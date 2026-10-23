// Validate the knowledge base. Run locally before pushing; CI runs the same script.
//
//   node maintenance/scripts/check.mjs            # all checks
//   node maintenance/scripts/check.mjs --no-index # skip the index freshness check
//
// Checks:
//   1. frontmatter exists, parses, and satisfies the schema for its type
//   2. no duplicate "Last reviewed" in the body (frontmatter is the single source)
//   3. every internal link resolves, every #anchor exists
//   4. heading anchors are unique within a document
//   5. index.json matches what the docs would generate
//   6. prose does not drift back into the formatting tics in CONTRIBUTING's writing rules
//
// External links are deliberately not fetched: this must run offline and fast.
// A separate scheduled workflow checks those.

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { ROOT, listDocs, readDoc, rel, headings, validateFrontmatter, FRONTMATTER_EXEMPT, VALID_TYPES } from "./lib.mjs";
import { existsSync } from "node:fs";
import { renderIndex } from "./build-index.mjs";

const errors = [];
const warnings = [];
const skipIndex = process.argv.includes("--no-index");

const docs = [];
for (const abs of await listDocs()) {
  docs.push(await readDoc(abs));
}

// Anchor table: path -> Set(anchor), built once, reused for link resolution.
const anchorsByFile = new Map();
for (const doc of docs) {
  const hs = headings(doc.text);
  const seen = new Set();
  for (const h of hs) {
    if (seen.has(h.anchor)) {
      errors.push(`${doc.file}:${h.line}: duplicate heading anchor "#${h.anchor}"`);
    }
    seen.add(h.anchor);
  }
  anchorsByFile.set(doc.file, seen);
}

for (const doc of docs) {
  // 1. frontmatter
  if (!doc.data) {
    if (!FRONTMATTER_EXEMPT.has(doc.file)) {
      errors.push(`${doc.file}: missing YAML frontmatter`);
    }
  } else {
    errors.push(...validateFrontmatter(doc.data, doc.file));
  }

  // 2. body must not duplicate the review date
  const bodyLines = doc.body.split("\n");
  bodyLines.forEach((line, i) => {
    if (/^Last reviewed:/i.test(line.trim())) {
      errors.push(
        `${doc.file}:${doc.bodyOffset + i + 1}: "Last reviewed:" belongs in frontmatter ` +
          `(last_reviewed), not in the body`,
      );
    }
  });

  // 3. internal links and anchors
  const text = doc.body.replace(/```[\s\S]*?```/g, "");
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = linkRe.exec(text)) !== null) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;

    if (target.startsWith("#")) {
      const anchor = target.slice(1);
      if (anchor && !anchorsByFile.get(doc.file)?.has(anchor)) {
        errors.push(`${doc.file}: broken in-page link "#${anchor}"`);
      }
      continue;
    }

    const [pathPart, anchor] = target.split("#");
    if (!pathPart) continue;
    const destAbs = path.resolve(path.dirname(doc.abs), pathPart);
    const destRel = rel(destAbs);
    const known = docs.find((d) => d.file === destRel);
    if (!known) {
      // Directory links and non-markdown files just have to exist.
      try {
        await stat(destAbs);
      } catch {
        errors.push(`${doc.file}: link target does not exist: ${pathPart}`);
      }
      continue;
    }
    if (anchor && !anchorsByFile.get(destRel)?.has(anchor)) {
      errors.push(`${doc.file}: link anchor does not exist: ${pathPart}#${anchor}`);
    }
  }
}

// 4b. index.json's declared conventions must describe something that exists. Without this the
// freshness check only proves the file matches its generator, which can be wrong in the same way
// twice. This is what would catch a stale directory name surviving a rename.
let parsedIndex = null;
if (!skipIndex) {
  try {
    parsedIndex = JSON.parse(await readFile(path.join(ROOT, "index.json"), "utf8"));
  } catch {
    // the freshness check below reports a missing or malformed index
  }
}
if (parsedIndex?.conventions) {
  const c = parsedIndex.conventions;
  for (const [key, value] of Object.entries(c)) {
    if (typeof value !== "string" || !key.endsWith("_dir")) continue;
    const base = value.split("*")[0].replace(/\/+$/, "");
    if (!existsSync(path.join(ROOT, base))) {
      errors.push(`index.json conventions.${key} points at "${value}", which does not exist`);
    }
  }
  for (const type of c.types ?? []) {
    if (!VALID_TYPES.includes(type)) {
      errors.push(`index.json conventions.types lists unknown type "${type}"`);
    }
  }
  const missing = VALID_TYPES.filter((t) => !(c.types ?? []).includes(t));
  if (c.types && missing.length) {
    warnings.push(`index.json conventions.types omits ${missing.join(", ")}; the schema allows more than it advertises`);
  }
}

// 5. index freshness
if (!skipIndex) {
  let current = null;
  try {
    current = await readFile(path.join(ROOT, "index.json"), "utf8");
  } catch {
    errors.push("index.json is missing: run `node maintenance/scripts/build-index.mjs`");
  }
  if (current !== null) {
    const expected = await renderIndex();
    if (current !== expected) {
      errors.push("index.json is out of date: run `node maintenance/scripts/build-index.mjs`");
    }
  }
}


// 6. Writing tics. Warnings, not errors: these are stylistic, and a legitimate use now and then is
// fine. CONTRIBUTING explains each one.
const TICS = {
  "em dashes": (body) => (body.match(/—/g) ?? []).length,
  "sentence bold bullets": (body) =>
    (body.match(/^\s*[-*] \*\*[^*]+\.\*\*/gm) ?? []).length,
  "puffed significance": (body) =>
    (body.match(/\b(plays? a (?:vital|crucial|key|pivotal) role|is a testament|evolving landscape|setting the stage)\b/gi) ?? []).length,
};
// CONTRIBUTING quotes the tics as counter-examples, so it trips its own check.
const TIC_EXEMPT = new Set(["CONTRIBUTING.md", "maintenance/README.md"]);
for (const doc of docs) {
  if (TIC_EXEMPT.has(doc.file)) continue;
  if (!["practice", "guide", "reference", "index", "meta"].includes(doc.data?.type ?? "index")) continue;
  const words = (doc.body.match(/\b\w+\b/g) ?? []).length;
  if (words < 120) continue; // too short for a rate to mean anything
  for (const [name, count] of Object.entries(TICS)) {
    const n = count(doc.body);
    const per1k = (n / words) * 1000;
    if (per1k > 2) warnings.push(`${doc.file}: ${name} (${n} in ${words} words). See CONTRIBUTING.md`);
  }
}

const practices = docs.filter((d) => d.data?.type === "practice");

for (const w of warnings) console.log(`warn  ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}
console.log(
  `OK  ${docs.length} documents, ${practices.length} practice pages, ` +
    `${anchorsByFile.size} files with anchors, links and index consistent`,
);
