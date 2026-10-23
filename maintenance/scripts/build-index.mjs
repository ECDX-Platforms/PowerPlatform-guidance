// Regenerate index.json from document frontmatter and headings.
//
//   node maintenance/scripts/build-index.mjs
//
// The index is committed so downstream tooling (retrieval, validators, agents)
// can read one file instead of crawling the tree. `node maintenance/scripts/check.mjs`
// fails if it drifts from the documents.
//
// Output is deterministic: no timestamps, no absolute paths. A clean rebuild
// must produce a byte-identical file, otherwise the diff is noise.

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { ROOT, listDocs, readDoc, sections, headings, rel, primitiveKind } from "./lib.mjs";

const SCHEMA_VERSION = 1;

async function build() {
  const docs = [];
  for (const abs of await listDocs()) {
    const doc = await readDoc(abs);
    const data = doc.data ?? {};
    docs.push({
      path: rel(abs),
      dir: path.dirname(rel(abs)) === "." ? "/" : path.dirname(rel(abs)),
      title: data.title ?? null,
      description: data.description ?? null,
      type: data.type ?? null,
      primitive: primitiveKind(rel(abs)),
      status: data.status ?? null,
      tags: data.tags ?? null,
      last_reviewed: data.last_reviewed ?? null,
      section_count: sections(doc.text).length,
      sections: sections(doc.text),
      headings: headings(doc.text).map((h) => ({ level: h.level, text: h.text, anchor: h.anchor, line: h.line })),
    });
  }

  return {
    schema_version: SCHEMA_VERSION,
    about:
      "Generated from document frontmatter by maintenance/scripts/build-index.mjs. Do not edit by hand. " +
      "section line ranges are 1-based and inclusive, relative to the file including frontmatter.",
    conventions: {
      practice_dir: "best-practices",
      explanatory_dir: "docs",
      dev_setup_dir: "dev-setup",
      maintenance_dir: "maintenance",
      packages_dir: "packages",
      templates_dir: "templates",
      types: ["practice", "guide", "reference", "template", "index", "meta"],
      package_primitives: {
        dir: "packages/*/.apm",
        note: "Installed into a consuming project by `apm install`, so indexed here for retrieval even though they are not knowledge-base docs.",
        kinds: ["skill", "instruction", "prompt", "agent"],
      },
    },
    docs,
  };
}

export async function renderIndex() {
  return JSON.stringify(await build(), null, 2) + "\n";
}

if (process.argv[1] && path.resolve(process.argv[1]) === import.meta.filename) {
  const json = await renderIndex();
  await writeFile(path.join(ROOT, "index.json"), json, "utf8");
  const parsed = JSON.parse(json);
  const practices = parsed.docs.filter((d) => d.type === "practice").length;
  console.log(
    `index.json written: ${parsed.docs.length} documents (${practices} practice pages), ` +
      `${parsed.docs.reduce((n, d) => n + d.section_count, 0)} sections`,
  );
}
