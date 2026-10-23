---
title: Naming Standards
description: Naming conventions for every Power Platform artifact: environments, solutions, tables, apps, flows, groups, identities, and branches
type: practice
tags: [naming, environments, solutions, dataverse, apps, flows, security-roles, groups, agents, azure-devops]
last_reviewed: 2026-10-23
---

Consistency beats cleverness. If you can't tell what something is from its name, rename it.

## Environments

Format `{org}-{type}`, lowercase, hyphen-separated. Examples below use `contoso` as the organisation:
`contoso-dev`, `contoso-test`, `contoso-uat`, `contoso-prod`. A dedicated chain inserts the workload
between the two: `{org}-{workload}-{type}`, e.g. `contoso-portal-prod`.

Region is not part of the name. An environment's region is chosen when it is created and is visible in
the admin centre, so encoding it again in the name duplicates something the platform already tracks and
stops matching the moment nobody renames after a move.

Personal: `dev-{first}-{last}` (`dev-juhis-jalopeura`). Scratch: `tmp-{purpose}`.

Building in `Default` is worth avoiding; see [environments.md](environments.md#default-environment).

## Solutions and publishers

- Solution `{PublisherPrefix}_{ProjectName}`, e.g. `contoso_CustomerPortal`. Display name matches the
  repo.
- The publisher prefix is set once per organisation and appears at the start of every custom table
  schema name. Choose five lowercase characters and keep them, because changing it later means renaming
  schema names. Examples here use `contoso_`.
- The prefix applies to components **you** own. First-party tables and components keep their Microsoft
  schema names; you extend them, you do not rename them.
- One solution per feature or epic, small enough to move between environments in minutes.

## Dataverse

| Artifact | Convention | Example |
| --- | --- | --- |
| Table | PascalCase, singular | `WorkOrder`, `SiteVisit` |
| Column | PascalCase, no abbreviations unless well known | `TotalAmount`, `StartDate` |
| Choice | PascalCase, values PascalCase | `StatusReason`: `Active`, `Closed` |
| Relationship | Platform default; don't override | (default) |
| Alternate key | `{Table}_{Column}` | `Account_ExternalId` |

No spaces or special characters in schema names; display names may be human-friendly.

Display and schema name should describe the same thing. The platform's own `DisplayName = Case,
SchemaName = Incident` is an inconsistency to work around, not a pattern to imitate.

## Apps

- App: `{Project}{Purpose}`, e.g. `CustomerPortalAdmin`, `FieldInspectionMobile`.
- Screens: PascalCase, `Scr` prefix, e.g. `ScrHome`, `ScrDetails`.
- Controls: `btnSubmit`, `lblTitle`, `txtName`, `galItems`, `cmbRegion`, `frmMain`.
- Variables `var` prefix (`varSelectedRecord`); collections `col` prefix (`colOrders`).

Default control names are the difference between a readable app and an archaeology project.

## Flows

`{TriggerType} | {Scope} | {Action}`: `Scheduled | Daily | Sync WorkOrders`.

Always solution-scoped; no personal flows in a shared environment. Name the trigger and the
outcome, not the implementation.

## AI agents

`{Domain} {Function}`: `HR Policy Assistant`, `Invoice Triage Agent`. The **description is
mandatory**: purpose, audience, criticality, data classification. It is all an inventory scan or a
reviewer has to work from. See [ai-agents.md](ai-agents.md).

## Security roles

`{AppName} {Access level}`: `Customer Portal Admin`, `Customer Portal User`. Copy a base role,
then adjust. Editing an out-of-the-box role causes confusion the next time someone reads the docs.

## Entra ID groups

Access and every role assignment go through groups ([security.md](security.md#entra-id-group-teams)).

| Purpose | Format | Example |
| --- | --- | --- |
| Environment security group | `sg-pp-{environment}` | `sg-pp-contoso-prod` |
| Group team for a security role | `sg-pp-{environment}-{role}` | `sg-pp-contoso-prod-sysadmin` |
| App or agent sharing | `sg-pp-{environment}-{app}` | `sg-pp-contoso-prod-portal-users` |
| Admin elevation | `sg-pp-admins-{scope}` | `sg-pp-admins-platform` |

Cloud-only security groups, owned by a named person, with users nested rather than added directly,
except in
personal developer environments.

## Service accounts

`svc-pp-{scope}`, where scope identifies the environment chain: `svc-pp-portal`, `svc-pp-billing`.
One per chain; reusing one across production environments defeats the point
([security.md](security.md#identities)).

## Azure DevOps

Project = org area. Repo = solution name, matching the Power Platform solution. Branches
`feature/{workitem}-{slug}`, `release/{version}`, `hotfix/{workitem}-{slug}`. Pipeline
`solution-release.yml`: the only path to test and prod.

## References

- [Microsoft: solution publishers and prefixes](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm#solution-publisher)
- [Microsoft: Power Apps coding guidelines](https://learn.microsoft.com/power-apps/guidance/coding-guidelines/overview)
