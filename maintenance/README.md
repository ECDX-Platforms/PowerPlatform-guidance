---
title: Maintenance
description: Repo upkeep: the validation scripts and the rules for changing the knowledge base structure
type: meta
---

Everything in here exists for the repo, not for readers. If you are here to build something, you want
[best-practices/](../best-practices/) or [dev-setup/](../dev-setup/) instead.

## Using this as a template

[using-as-a-template.md](using-as-a-template.md) covers starting a new knowledge base from this one: what
machinery is worth copying, what has to be replaced, and what breaks if you copy blindly.

## Scripts

Two Node scripts, no dependencies, so they run with a bare Node install.

| Script | Does |
| --- | --- |
| `scripts/build-index.mjs` | Regenerates [index.json](../index.json) from document frontmatter and headings |
| `scripts/check.mjs` | Validates frontmatter, internal links, anchors, index freshness, and writing tics |
| `scripts/lib.mjs` | Shared parsing: frontmatter, heading anchors, section ranges |

```bash
node maintenance/scripts/build-index.mjs   # after editing or adding docs
node maintenance/scripts/check.mjs         # before pushing
```

`check.mjs` takes `--no-index` to skip the index freshness check, which is handy while iterating on a
single doc.

Both run in CI on every pull request that touches a markdown file, `index.json`, or the scripts.
The workflow also validates the [APM packages](../packages/) and checks external links on a schedule.

## Why the scripts live here

They are maintenance tooling. A developer or consultant will never run them, and putting them at the
repo root made them look like part of the knowledge base. They are also the only Node in a repo that
is otherwise pure prose, so hiding them keeps the layout honest.

`index.json` stays at the root despite being generated, because downstream tooling fetches it by path.

## Structure rules

Changing the layout is a bigger decision than it looks. What the checker looks for:

| Rule | Why |
| --- | --- |
| Frontmatter `type` matches the folder | Lets a reader or an agent trust the path |
| `last_reviewed` on practices, guides and references | Freshness is the main reason to distrust a page |
| Every internal link and anchor resolves | A dead cross-reference is worse than none |
| `index.json` regenerated in the same commit | A stale manifest is a lie with a schema |
| No em-dash, sentence-bold or puffery clusters | See the writing section in [CONTRIBUTING](../CONTRIBUTING.md) |

## Adding a folder

1. Put a `README.md` in it with `type: index`, explaining what belongs there and what does not.
2. Add the folder to the repository map in [AGENTS.md](../AGENTS.md) and to the layout table in
   [README.md](../README.md).
3. If it contains content docs, add its expected `type` values to the family map in
   `scripts/check.mjs`.
4. Regenerate the index and run the check.
