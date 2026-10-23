// Shared parsing helpers for the knowledge-base scripts.
// No dependencies: this repo must stay runnable with a bare Node install.

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const ROOT = path.resolve(import.meta.dirname, "..", "..");
const SKIP_DIRS = new Set([".git", ".agents", ".claude", "node_modules"]);

export const VALID_TYPES = ["practice", "guide", "reference", "template", "index", "meta"];

/** Files that carry no frontmatter by design. Empty today; kept so exemptions stay explicit. */
export const FRONTMATTER_EXEMPT = new Set([]);

/** Every markdown file in the repo, excluding vendored tooling. */
export async function listDocs(root = ROOT) {
  const out = [];
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      // .apm/ holds the APM package primitives. They are excluded everywhere else, but they are
      // agent-facing content: `apm install` deploys them into a project, so retrieval must see them.
      if (entry.name.startsWith(".") && entry.name !== ".apm") continue;
      if (SKIP_DIRS.has(entry.name)) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(abs);
      else if (entry.name.endsWith(".md")) out.push(abs);
    }
  }
  await walk(root);
  return out.sort();
}

export function rel(abs, root = ROOT) {
  return path.relative(root, abs).split(path.sep).join("/");
}

/**
 * Parse the small YAML subset used in this repo: `key: value`, `key: [a, b]`,
 * quoted scalars. Anything richer is a bug we want to surface, not support.
 */
export function parseFrontmatter(text, file) {
  if (!text.startsWith("---\n")) return { data: null, body: text, bodyOffset: 0 };
  const end = text.indexOf("\n---", 3);
  if (end === -1) throw new Error(`${file}: frontmatter opened but never closed`);
  const raw = text.slice(4, end);
  const bodyStart = text.indexOf("\n", end + 1) + 1;

  const data = {};
  for (const line of raw.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    // camelCase keys appear in APM/Skill frontmatter (applyTo, allowed-tools)
    const m = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line);
    if (!m) throw new Error(`${file}: unparseable frontmatter line: ${line}`);
    const [, key, rest] = m;
    let value = rest.trim();
    if (value.startsWith("[")) {
      if (!value.endsWith("]")) throw new Error(`${file}: unterminated list for "${key}"`);
      value = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: text.slice(bodyStart), bodyOffset: bodyStart };
}

/** GitHub-style heading anchor. */
export function slugify(text) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*~]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, "")
    .replace(/ /g, "-");
}

/** Headings outside fenced code blocks, with 1-based line numbers. */
export function headings(text) {
  const out = [];
  const lines = text.split("\n");
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      fence = !fence;
      continue;
    }
    if (fence) continue;
    const m = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
    if (m) {
      out.push({ level: m[1].length, text: m[2], anchor: slugify(m[2]), line: i + 1 });
    }
  }
  return out;
}

/**
 * Retrieval units: each level-2 heading plus its content, cut before the next
 * heading of the same or higher level. Falls back to level-1 when a doc uses no H2.
 */
export function sections(text) {
  const all = headings(text);
  if (all.length === 0) return [];
  const total = text.split("\n").length;
  const level = all.some((h) => h.level === 2) ? 2 : 1;
  const tops = all.filter((h) => h.level === level);
  return tops.map((h, i) => {
    const next = tops[i + 1];
    const endLine = next ? next.line - 1 : total;
    return {
      anchor: h.anchor,
      heading: h.text,
      start_line: h.line,
      end_line: endLine,
      subsections: all
        .filter((s) => s.level > level && s.line > h.line && s.line < (next ? next.line : total + 1))
        .map((s) => s.anchor),
    };
  });
}

/**
 * Catch frontmatter that the naive parser tolerates but a real YAML parser rejects. The important
 * case is an unquoted value containing ": ", which YAML reads as a nested mapping and which editors
 * and Git hosts reject outright.
 */
export function yamlSafetyIssues(text, file) {
  if (!text.startsWith("---\n")) return [];
  const end = text.indexOf("\n---", 3);
  if (end === -1) return [];
  const issues = [];
  const lines = text.slice(4, end).split("\n");
  lines.forEach((line, i) => {
    const m = /^([A-Za-z_][\w-]*):\s(.*)$/.exec(line);
    if (!m) return;
    const value = m[2];
    const lineNo = i + 2;
    if (value === "") return;
    if (value.startsWith('"') || value.startsWith("'")) return;
    if (value.includes(": ")) {
      issues.push(
        `${file}:${lineNo}: unquoted "${m[1]}" contains ": ", which YAML reads as a nested mapping. Quote the value`,
      );
    }
    if (/\s#/.test(value)) {
      issues.push(`${file}:${lineNo}: unquoted "${m[1]}" contains " #", which YAML reads as a comment. Quote the value`);
    }
    if (value.startsWith("[") && !value.endsWith("]")) {
      issues.push(`${file}:${lineNo}: "${m[1]}" starts a list but does not close it`);
    }
  });
  return issues;
}

/** APM primitives carry a skill/instruction frontmatter shape, not the doc shape. */
export function primitiveKind(file) {
  if (!file.includes(".apm/")) return null;
  if (file.endsWith("/SKILL.md")) return "skill";
  if (file.endsWith(".instructions.md")) return "instruction";
  if (file.endsWith(".prompt.md")) return "prompt";
  if (file.endsWith(".agent.md")) return "agent";
  return "other";
}

export function validateFrontmatter(data, file) {
  const errors = [];
  if (primitiveKind(file)) {
    if (!data.description) errors.push(`${file}: missing frontmatter "description"`);
    if (primitiveKind(file) === "skill" && !data.name) errors.push(`${file}: missing frontmatter "name"`);
    return errors;
  }
  const need = (key) => {
    if (!(key in data) || data[key] === "") errors.push(`${file}: missing frontmatter "${key}"`);
  };

  for (const key of ["title", "description", "type"]) need(key);
  if (!data.type) return errors;

  if (!VALID_TYPES.includes(data.type)) {
    errors.push(`${file}: type "${data.type}" not one of ${VALID_TYPES.join(", ")}`);
  }

  if (data.type === "practice") {
    for (const key of ["tags", "last_reviewed"]) need(key);
  }

  if (["guide", "reference"].includes(data.type)) {
    for (const key of ["tags", "last_reviewed"]) need(key);
  }

  if (data.last_reviewed && !/^\d{4}-\d{2}-\d{2}$/.test(data.last_reviewed)) {
    errors.push(`${file}: last_reviewed must be YYYY-MM-DD`);
  }

  return errors;
}

export async function readDoc(abs) {
  const file = rel(abs);
  const text = await readFile(abs, "utf8");
  const { data, body, bodyOffset } = parseFrontmatter(text, file);
  return { abs, file, text, data, body, bodyOffset };
}
