---
title: Choosing an App Type
description: Decision guide for picking between canvas apps, model-driven apps, and Code Apps, with maker notes for each
type: guide
tags: [canvas-apps, model-driven-apps, code-apps, dataverse, ui]
last_reviewed: 2026-10-23
---

When in doubt, model-driven wins for Dataverse data.

| Question | Canvas | Model-driven | Code App |
| --- | --- | --- | --- |
| Dataverse data with relationships? | Possible, but you rebuild forms and views | Native | You build the UI |
| Pixel-perfect or unusual mobile layout? | Its strength | Constrained by platform UI | Its strength |
| Embed in SharePoint, Teams, Power BI? | Yes | Limited | Yes |
| Complex roles, business rules, auditing? | Security applies; you wire the UI and validation | Built in and surfaced | You build it |
| Long-lived business process app? | Painful at scale | Designed for it | Depends on your discipline |

**Rule of thumb: model-driven for systems of record, canvas for task-focused UX, Code Apps
only when you need a real frontend and can carry the maintenance.**

All three live in solutions and follow [naming](../best-practices/naming.md). Code Apps have extra
constraints: see [coding.md](../best-practices/coding.md#code-apps).

## Model-driven app notes

- Build on Dataverse tables. Forms, views, and business rules belong to the table, not the app,
  so they apply everywhere the table appears.
- Declarative first: business rules, calculated columns, Power Fx commands and flows ahead of plugins.
- Use the modern designer only; the classic designer is deprecated.
- Security comes from Dataverse roles plus column-level security. Design the roles before
  building the forms, or you will retrofit them badly.

## Dataverse notes

- Model the data first: tables, relationships, and choices before any UI.
- Use standard tables where they fit; custom tables where they don't. Standard tables inherit
  integrations you'd otherwise rebuild.
- Enable auditing and duplicate detection at table creation. Adding them later means the
  history you wanted doesn't exist.

## Related

- [coding.md](../best-practices/coding.md#canvas-apps): formula and structure rules
- [alm.md](../best-practices/alm.md#how-much-process): how much process the choice implies
- [environments.md](../best-practices/environments.md): where it will run

## Reference

- [Model-driven apps](https://learn.microsoft.com/power-apps/maker/model-driven-apps/)
- [Dataverse](https://learn.microsoft.com/power-apps/maker/data-platform/)
