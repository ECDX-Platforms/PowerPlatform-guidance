---
title: Using This as a Template
description: What to reuse when starting a new knowledge base from this one, what to replace, and what will break if you copy blindly
type: meta
---

This repo is one instance of a shape, not a sacred text. The shape is worth copying. The content is about
Power Platform, so most of it will not survive a change of subject.

Two things are portable: the **machinery** that keeps a knowledge base honest, and the **house rules**
about how pages are written. Everything else is subject matter.

## The portable machinery

Copy these wholesale. None of it knows what the repo is about.

| Thing | What it buys you |
| --- | --- |
| `maintenance/scripts/` | Frontmatter, link and anchor validation, generated index, writing-tic lint. No dependencies |
| `index.json` | A machine-readable manifest: every page, metadata, heading anchors, section line ranges |
| `maintenance/README.md` | The structure rules the checker enforces, and why each exists |
| `.github/workflows/docs-check.yml` | CI split into structure (every PR, offline) and external links (scheduled) |
| `AGENTS.md` | Routing, precedence, reading recipes, citation format. The agent contract |
| `CONTRIBUTING.md` | Frontmatter schema, writing rules, pre-PR checks |
| Folder family names | `check.mjs` maps folder to `type`, so renaming folders means editing the checker first |

The folder discipline is the part people skip and regret. A checker that silently skips a folder is worse
than no checker, because what it does report looks like a clean bill of health.

## The portable house rules

These are about writing for a human and a retrieval window at the same time, and they apply to any
subject:

- One topic per page, kebab-case filenames.
- Every `##` section stands alone, because retrieval slices at headings. "As noted above" loses its
  meaning when chunked.
- Sections under about 40 lines. Long sections chunk badly.
- Tables for mappings, checklists for obligations, prose only for reasoning a table cannot hold.
- Name the failure, not only the rule. "A miswired reference writes production data into the wrong
  system, quietly" is actionable; "be careful with references" is not.
- No em-dash clusters, no bold lead-in on every bullet, no rule-of-three padding. The reasoning is in
  `CONTRIBUTING.md`.
- Say when something is unverified, and cite the authority. Guidance that cannot be traced is expensive
  to trust.

## What to replace

| Part | Why it cannot travel |
| --- | --- |
| `best-practices/` | Subject matter. This set is about Power Platform delivery |
| `docs/` guides and reference | Same. Decision guides encode platform-specific choices |
| `docs/glossary.md` | Terms are subject-specific. Keep the format, replace the rows |
| `dev-setup/` | The CLIs, extensions and MCP servers are platform tools |
| `packages/` | The APM primitives encode this subject's workflows |
| `docs/coverage.md` | Rewrite first: it tells a reader and an agent whether the repo applies at all |
| Examples and identifiers | Replace placeholder org names and publisher prefixes with real ones |

## Starting a new one

1. Copy the tree, including `maintenance/`, `.github/` and the four root files.
2. Rewrite `docs/coverage.md` before anything else. Scope first; content is easier once the boundary is
   written down.
3. Replace the subject folders. Delete what does not apply rather than leaving it: a page that does not
   apply implies a relevance it does not have.
4. Update the family map in `maintenance/scripts/check.mjs` if the folder names change at all.
5. Update the repository maps in `README.md` and `AGENTS.md` so an agent routes into the new pages.
6. Regenerate and validate:

```bash
node maintenance/scripts/build-index.mjs
node maintenance/scripts/check.mjs
```

The checker is the most useful part of the copy. Renaming or deleting pages breaks links and anchors, and
it will list every one. Work through its output, then start writing.

Bump every `last_reviewed` date at the same time, because none of the inherited ones are true any more.

## What the machinery cannot tell you

`check.mjs` proves internal consistency, not correctness. It cannot know that a claim is out of date, that
a table is unreadable to a human, or that advice is right in general and wrong for your subject. Three
habits cover it:

Cite the authority rather than a write-up, so a reader can check you. Re-read each page as a newcomer: if
you cannot tell what it is for within a minute, it needs a different first paragraph rather than more of
them. And test the claims that are cheap to test, because a five-minute experiment in a dev environment
beats an argument about what the documentation meant.

## A worked example

Four kinds of advice change when the subject changes, and are worth hunting for first.

**Advice can invert.** Generic guidance here says managed customisation layers are fine and unmanaged
production edits are not. In a subject where the vendor ships the baseline application, you are *always*
layered, so "avoid layers" copied verbatim is either obviously wrong or quietly harmful.

**The vendor may own the roadmap.** If the subject has a first-party product on a release schedule, your
repo needs upgrade and deprecation guidance that general practice has no reason to contain.

**Some configuration may not travel in the package.** Objects or settings needing their own ordered
migration belong on their own page, with what the process excludes spelled out.

**Licensing may be its own matrix.** Per-persona entitlement is usually more specific than the generic
version.

The pattern underneath: keep the structure, re-derive the substance, and re-examine every piece of advice
whose truth depends on who owns the baseline.
