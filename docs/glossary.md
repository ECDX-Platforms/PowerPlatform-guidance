---
title: Glossary
description: Shared terminology for Power Platform work: ALM, solutions, Dataverse, security, DLP, and governance terms
type: reference
tags: [glossary, terminology, alm, dataverse, dlp, governance, security]
last_reviewed: 2026-10-23
---

| Term | Meaning |
| --- | --- |
| ALM | Application Lifecycle Management: the dev → test → prod process including pipelines and approvals |
| BAP API | `api.bap.microsoft.com`, the tenant and environment admin API behind PPAC |
| Business rule | Declarative logic on a table. Form scope is client-only; Entity scope is documented as running server-side too, though Microsoft's docs conflict |
| Calculated column | Column computed from other columns in the same record, or from a many-to-one parent, when the record is read |
| Canvas App | WYSIWYG Power Fx app, any data source, pixel-level control |
| Code App | React/TypeScript app hosted by Power Platform, built with the `pa` CLI, using connectors for data |
| CMK | Customer Managed Key: customer-held encryption key for Dataverse |
| CoE | Centre of Excellence: the function governing the platform |
| Connection reference | Solution component binding a flow or app to a connection, configured per environment |
| Custom API | A Dataverse message you define, backed by a plug-in class, so logic can be reused and called like a built-in operation |
| CSP | Content Security Policy: browser-enforced rules on what an app may load or call |
| Dataverse | The platform's data store (formerly CDS): tables, roles, auditing |
| DV4T | Dataverse for Teams. Deprecated; creation ends Nov 2026 ([timeline](../best-practices/environments.md#dataverse-for-teams-is-being-retired)) |
| Default environment | The personal productivity environment everyone gets; worth locking down |
| DLP | Data Loss Prevention policy: connector grouping and blocking per tenant or environment |
| DV4T | Dataverse for Teams |
| Environment variable | Solution component holding per-environment configuration values |
| Layer | Override on top of a managed component. Best avoided: it breaks the link between the repo and what runs |
| Low-code plug-in | Server-side, real-time Power Fx logic attached to a table event. **Preview** |
| Managed / Unmanaged | Managed = read-only components (test, prod). Unmanaged = editable (dev only) |
| Managed Environments | Premium environment capabilities: sharing limits, pipelines, Managed Security, usage insights |
| Model-driven App | Data-first app built on Dataverse tables, forms, and views |
| Orphaned solution | A business-critical solution with no owner: the end state of unmanaged tech debt |
| PDD / SDD | Product Design Document / Solution Design Document: the two documents "full documentation" means |
| PIM | Privileged Identity Management: just-in-time elevation of admin roles |
| PPAC | Power Platform Admin Center |
| Pseudo prod | A non-prod environment used as production; the main governance failure mode |
| Publisher | Owns the prefix used by a solution's schema names. Set once per organisation; the examples here use `contoso_` |
| RLS | Row-level security: filtering rows by who is asking |
| Rollup column | Column holding an aggregate over related child records, recalculated on a schedule rather than during the save |
| Smoke test | The paths a user takes on a normal day, run to confirm a deployment did not break something |
| Separation of duty | Developers can't deploy to or edit prod; service accounts own prod artifacts |
| Solution | A list of components moved between environments; the unit of ALM |
| SPN | Service principal: an Entra ID app identity used for automation |
| SVC | Service account: a licensed identity with a vaulted password, used for component ownership |
| Tenant isolation | Tenant setting blocking cross-tenant connector access, inbound and outbound |
| USL | User subscription license |
| Workflows (Copilot Studio) | The automation builder for agent flows: same engine as Power Automate, different billing and UI |

Platform vocabulary that looks generic but isn't: a **solution** is a deployable unit, not a
fix for a problem; an **environment** is a governance boundary, not a folder.
