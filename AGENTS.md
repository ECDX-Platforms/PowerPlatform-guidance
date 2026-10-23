---
title: Agent Guide
description: Routing, precedence, citation conventions, and consumption rules for AI agents working in this knowledge base
type: meta
---

# Agent Guide

The file name is `AGENTS.md` because that is the convention tools look for. This repo is a
knowledge base for automated development as well as human reference. Two audiences:
engineers and AI agents. This file tells an agent where things are, what is binding, and how to
read the minimum it needs.

## Repository map

| Path | Type | Contents |
| --- | --- | --- |
| `best-practices/` | guidance | What tends to work, and why. Apply with judgement. |
| `dev-setup/` | practical | Editor, CLIs, MCP servers, and the Microsoft agent skills |
| `docs/` | explanatory | Glossary, API reference, how-to guides, scope statement. |
| `templates/` | starting points | Copy and adapt; don't invent parallel structures. |
| `packages/` | distributable | APM packages that carry these standards into a project |
| `maintenance/` | repo tooling | Validation scripts. Not knowledge-base content |
| `index.json` | generated | Machine-readable manifest: every doc, metadata, heading anchors, section line ranges. |

## Read this first

If the platform vocabulary is unfamiliar, `docs/glossary.md` is the intended first read: much of it is
counter-intuitive, and a wrong assumption about what "environment" or "solution" means propagates
into everything else.

`best-practices/environments.md` is the spine. **The environment you deploy into sets the minimum bar**: 
build in a developer environment and almost nothing applies, put the same artifact in production and
everything does. Then `best-practices/alm.md#how-much-process` covers the two things that raise the bar
further: whether it is a core business process, and what data it touches.

Establish which environment and which data class you are dealing with before quoting any other
standard. Don't apply a production bar to a developer-environment experiment, or the reverse.

## Routing

| Task involves | Read |
| --- | --- |
| Environments, what each is for, chains, expiry | `best-practices/environments.md` |
| Deciding how much process applies | `best-practices/alm.md#how-much-process` |
| Naming anything | `best-practices/naming.md` |
| Identities, roles, groups, isolation, auditing, DLP, secrets | `best-practices/security.md` |
| Solutions, managed/unmanaged, complexity, version control, pipelines, documentation | `best-practices/alm.md` |
| Canvas apps, flows, plugins (C#), Code Apps | `best-practices/coding.md` |
| Copilot Studio agents, AI features | `best-practices/ai-agents.md` |
| Testing and the definition of done | `best-practices/release-checklist.md` |
| How to test, in practice | `docs/testing.md` |
| Writing a PDD or SDD | `templates/project/pdd-template.md`, `sdd-template.md` |
| Whether this repo answers the question at all | `docs/coverage.md` |
| Choosing an app type (do this first) | `docs/choosing-app-type.md` |
| Choosing where logic lives, once the app type is settled | `docs/choosing-component.md` |
| An unfamiliar term, or a first read | `docs/glossary.md` |
| Which API to call | `docs/power-platform-apis.md` |
| Getting a workstation ready | `dev-setup/README.md` |
| VS Code extensions, MCP configuration | `dev-setup/vscode.md` |
| `pac` vs `pa` | `dev-setup/cli.md` |
| Microsoft agent skills and plugins | `dev-setup/skills.md` |
| Making this project follow the standards automatically | `packages/README.md` |

## Precedence

When two documents disagree, the earlier wins:

1. `best-practices/` generally carries more weight than `docs/`, which explains rather than recommends.
2. More specific over more general: a rule in `security.md` beats a general remark in `alm.md`.
3. A document's own stated exceptions beat its general rule.

If a conflict survives that, surface it. Do not resolve silently: that is how two docs become four.

## Minimum reading

The routing table above is the index. For the common tasks, the shortest useful set:

| Task | Read |
| --- | --- |
| Scaffold something new | `environments.md`, `alm.md#how-much-process`, `naming.md` |
| Provision a chain | `environments.md`, `docs/environment-setup.md` |
| Write logic | `docs/choosing-component.md`, `coding.md` |
| Release | `release-checklist.md`, `alm.md#getting-to-production` |

## Using index.json

Prefer the index over crawling the tree.

- `docs[].path`, `title`, `description`, `tags`: routing and search.
- `docs[].sections[].start_line` / `end_line`: slice a section without guessing boundaries.
- `docs[].headings[].anchor`: exact anchor for a citation.

`index.json` is generated, so edit it through the docs rather than by hand. Regenerate with
`node maintenance/scripts/build-index.mjs`.

It covers knowledge-base docs and, additionally, the APM package primitives under `packages/*/.apm/`.
Those carry a `primitive` field (`skill`, `instruction`) rather than a `type`, because they are
installed into a consuming project rather than read here. They are indexed so you can find a skill by
name: `walk-release-checklist` and `assess-change-risk` live there.

## Citation

Cite file path plus heading anchor, so a human can verify in one click and an agent can relocate
the text without a full read:

```
best-practices/security.md#dlp-policies
```

Cite the rule you actually relied on. "Per the standards" is not a citation.

## How to use this repo

1. **These are practices, not rules.** `best-practices/` holds what tends to work and why. Apply it
   with judgement. If a page looks wrong for the situation, say so and explain why rather than
   quietly ignoring or blindly following it.
2. **Context before advice.** State the environment and data class you assumed whenever the answer
   depends on them. Most of this repo is conditional and reads as absolute if you skip that step.
3. **Silence is not permission, and it is not prohibition.** If the repo has no answer, say so and
   name what you decided instead. See `docs/coverage.md`.
4. **Surface the judgement, do not absorb it.** Some questions are deliberately left to a human:
   whether something is a core business process, whether a preview feature is acceptable, whether data
   is confidential. State the assumption and ask. An agent that quietly decides "not core" has removed
   the decision from the person who owns it.
5. **Templates are starting points.** Copy from `templates/` and adapt rather than inventing a
   parallel structure.
6. **Respect freshness.** Pages carry `last_reviewed`. Platform behaviour moves, so verify against
   current Microsoft Learn when a page is older than a few months, or when specifics matter.
7. **Link rather than copy.** Point at Microsoft docs instead of paraphrasing them here, so the two
   copies cannot disagree.
8. **No secrets** in docs or generated code: no connection strings, tokens or credentials. See
   `best-practices/security.md#secrets-and-credentials`.
9. **Avoid duplicating advice.** If it already exists, link to it. Two copies drift apart.
10. **Security concerns** about this documentation go through `SECURITY.md`, not public issues.
11. **Flag preview and community dependencies.** If a mechanism is in preview, or a dependency is
    community-maintained, say which and what happens if it never ships or is abandoned.

## Vocabulary this repo uses

- **Publisher prefix**: set once per organisation, used by every custom table schema name. Examples
  here use `contoso_`; substitute your own.
- **Pseudo prod**: a non-prod environment used as production. A governance failure mode we actively control.
- **Two kinds of solution layer.** A managed layer from your own solution is how you customise a
  Microsoft managed solution and is expected. An unmanaged layer from editing production is the problem:
  it survives imports and leaves the repo describing something that is not running.
- **Environment naming**: `{org}-{type}`, e.g. `contoso-dev`. Shared stacks per organisation, not per
  team. A workload gets a dedicated chain (`{org}-{workload}-{type}`) only when it earns one. Region is
  not part of the name: the platform records it at creation.
- **Flow naming**: `{TriggerType} | {Scope} | {Action}`.
- **Rigour follows the environment**, not a project size label. There is production, and there is
  everything before it.
