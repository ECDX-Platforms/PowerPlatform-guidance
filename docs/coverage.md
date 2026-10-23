---
title: Coverage and Non-Goals
description: What this knowledge base covers, what it deliberately does not, and what to do when it has no answer
type: reference
tags: [scope, coverage, out-of-scope, gaps, routing]
last_reviewed: 2026-10-23
---

A knowledge base is as much defined by what it excludes as by what it contains. This page exists
so that neither a reader nor an agent mistakes silence for permission.

## In scope

Platform engineering and delivery for Power Platform and Dataverse:

- Environment strategy, provisioning, lifecycle
- Solutions, ALM, CI/CD
- Security, identity, access, DLP
- Canvas apps, model-driven apps, Code Apps, flows, plugins, agents
- Testing and release quality
- Naming and configuration conventions
- Choosing an app type, and choosing where business logic lives

## Out of scope

Deliberately not covered here. Take these to the owning function instead of inferring an answer
from this repo.

| Area | Where it belongs |
| --- | --- |
| Dynamics 365 functional and module content | Documented separately |
| Azure and networking architecture beyond the Power Platform boundary | Cloud platform standards |
| Licence entitlement, pricing, and contract terms | Commercial owners |
| Data protection, records retention, and classification policy | Legal and compliance, referenced by [security.md](../best-practices/security.md#data-classification) |
| Change management, intake, and ITSM process detail | Service management |
| Software development model and approval process at org level | Engineering governance |
| Repo tooling and validation scripts | [maintenance/](../maintenance/), which is not knowledge-base content |
| Vendor tooling detail (skills, CLIs, MCP) | Microsoft's docs, routed from [dev-setup](../dev-setup/) |

This repo states *how to build*, and only as much of *what to build* as the platform requires.

## Known gaps

Real gaps, not deliberate exclusions. Contributions welcome: see
[CONTRIBUTING.md](../CONTRIBUTING.md).

- Dataverse modelling depth: table design, relationship types, and key strategy are mentioned,
  not taught. The Microsoft `dataverse` skill covers much of it; see [../dev-setup/skills.md](../dev-setup/skills.md).
- Power Pages standards: covered only as an environment/infrastructure concern.
- Per-plugin guidance for the Microsoft agent skills. We route to them rather than restate them.
- Dynamics 365 application content of any kind: documented in its own place, not here.
- Business units and hierarchical security: mentioned, not worked through.
- Product-specific guidance. This repo is domain-general; a product area needs its own pages. See
  [using-as-a-template.md](../maintenance/using-as-a-template.md).
- Per-industry or regulatory control mapping.
- Performance and scale planning beyond individual app guidance.

## If this knowledge base has no answer

1. **Do not** treat absence as approval. An undocumented area is an undecided area.
2. Check [glossary.md](glossary.md) and [index.json](../index.json) to confirm nothing covers it.
3. Fall back to the platform's own documentation, and say that is what you did.
4. Raise the gap: a missing standard is a standard worth writing.

For an agent producing work: state what you had to decide without a standard, and why. That
sentence is more useful than a confident guess.

## How coverage is tracked

`index.json` records every document, its type, and its status. A topic that appears in
this page as a gap but has no `best-practices/` entry is still a gap; if it gains one, remove it from
the list above.
