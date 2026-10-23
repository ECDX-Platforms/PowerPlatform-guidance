---
title: Contributing
description: Frontmatter schema, writing conventions, and the checks that run on a pull request
type: meta
---

Don't silently diverge from a standard you disagree with. Change the doc.

## Where things go

| You're adding | Put it in | `type` |
| --- | --- | --- |
| A rule we must follow | `best-practices/` | `standard` |
| An explanation or how-to | `docs/` | `guide` or `reference` |
| A starting point to copy | `templates/` | `template` |
| Workstation setup (editor, CLIs, MCP) | `dev-setup/` | `guide` or `reference` |
| Repo tooling changes | `maintenance/` | `meta` |
| A folder index | `README.md` | `index` |
| Repo furniture | root | `meta` |

Before adding a file, check whether an existing one should grow instead. Most contributions belong
in a section of an existing doc, not in a new file.

## Frontmatter schema

Every markdown file starts with YAML frontmatter. `node maintenance/scripts/check.mjs` checks this.

```yaml
---
title: Security and Access Management
description: One sentence. Used for routing, search snippets, and the index.
type: practice                     # practice | guide | reference | template | index | meta
tags: [security, dlp]
last_reviewed: 2026-10-23          # standard, guide, reference
---
```

- **`last_reviewed`** is the only place the review date lives. Don't repeat it in the body: the
  check fails if you do.

## Writing for people and agents

The same text is read by a human in a review and by a model in a retrieval window. Both reward the
same things.

- Lead with the practice, then one line on why. The reason is what tells a reader when it stops
  applying.
- One idea per bullet, imperative mood.
- Make every `##` section stand alone. Retrieval slices at headings, so a section that says "as noted
  above" loses its meaning when chunked. Repeat the noun, not the paragraph.
- Keep sections under about 40 lines. Long sections chunk badly.
- Name headings for their content. `## Pseudo prod` beats `## The problem`.
- Use tables for mappings and checklists for obligations. Reach for prose only for reasoning that a
  table cannot hold.
- Don't hedge. "Consider" and "where possible" cannot be acted on. Either it is a rule or it is not.
- Name the failure, not only the rule. "A miswired connection reference writes production data into
  the wrong system, quietly" is actionable. "Be careful with connection references" is not.
- Don't duplicate a rule. Link to the original; a second copy drifts.

### Signs of machine-written text

Prose here is read by engineers who notice. The patterns below are overused, not banned, but this
repo had a bad case of two of them.

- Em dashes everywhere. They are not punctuation glitter. Most of the time you want a colon, a
  comma, a full stop or brackets. If a paragraph has two, it has one too many.
- Bold lead-in on every bullet. `**Thing.** Explanation,` repeated down a list is a formatting
  tic. Lead with the sentence instead; keep bold for genuine labels and legends.
- Rule of three. Three adjectives or three clauses because three sounds complete. Use two, or
  four, or the one word that is right.
- Puffed significance. "Plays a crucial role in the evolving landscape" says nothing. State the
  fact and stop.
- Trailing analysis clauses. ", highlighting the importance of..." and its relatives are
  decoration bolted onto the end of a sentence. Cut them or make the claim plainly.

Read the result back and ask whether a person would write it that way. If the answer is "a person
trying to sound authoritative", rewrite it.

## Before you open a PR

```bash
node maintenance/scripts/build-index.mjs   # regenerate the manifest
node maintenance/scripts/check.mjs         # frontmatter, links, anchors, index freshness
```

- [ ] `node maintenance/scripts/check.mjs` passes.
- [ ] `index.json` regenerated and committed.
- [ ] Folder README index updated if you added, renamed, or removed a file.
- [ ] `last_reviewed` updated on any page you touched.
- [ ] No rule duplicated: link to the original instead.

The release checklist is a plain checklist: add an item where it belongs, remove one that no longer
earns its place. No numbering to maintain.

## Security

Found a security problem with something documented here: a bad example, a dangerous
recommendation, a control described incorrectly? Don't open a public issue. Follow
[SECURITY.md](SECURITY.md).
