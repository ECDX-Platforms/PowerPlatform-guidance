---
title: Power Platform APIs
description: Which API to call for what, and how each one authenticates
type: reference
tags: [apis, power-platform-api, dataverse-web-api, spn, auth, automation]
last_reviewed: 2026-10-23
---

Most platform automation reaches one of two places. Picking the right one first saves confusion, because
they authenticate differently and expose different things.

| What you are automating | Call |
| --- | --- |
| Environments, governance, capacity, tenant-wide admin | **Power Platform API** (`api.powerplatform.com`) |
| Tables and records, data model, sharing, solution-aware flows | **Dataverse Web API** (`{env}.crm.dynamics.com`) |

## Power Platform API

Microsoft positions this as the unified programmability surface for environment management, tenant-wide
governance, and capacity insight. If you are writing automation for administrators rather than makers,
this is the intended entry point.

It consolidates a set of older admin endpoints that were never designed as a coherent API, so expect
older material to point at different hostnames for the same job.

## Dataverse Web API

The OData surface over Dataverse: tables, records, metadata, and the `workflow` table that holds
solution-aware cloud flows. Sharing goes through `GrantAccess`.

Both APIs support app-only authentication with a service principal. Registering the management app for
the Power Platform API is a separate step from creating the Dataverse application user, and doing one
without the other is the usual cause of a 401 that looks like a permissions problem.

## Practical notes

A flow that is not in a solution is not in Dataverse. Solution-aware flows appear in the `workflow`
table and travel with the solution; personal flows do not, and are administered elsewhere. If a flow
seems missing from a query, check which kind it is before concluding the query is wrong.

Decide whether you need admin scope or data scope before requesting a token. Asking for the wrong
audience fails in a way that suggests the account is at fault rather than the request.

Verify identity claims in your own tenant. Which permissions an API accepts changes faster than
documentation tracks, including on this page. A five-minute test against a dev environment beats
building automation on a write-up.

## Related

- [security.md](../best-practices/security.md#identities): which identity should call these
- [glossary.md](glossary.md): PPAC, SPN
- [coverage.md](coverage.md): what this repo does and does not cover

## Reference

- [Microsoft: get started with Power Platform API](https://learn.microsoft.com/power-platform/admin/power-platform-api-overview)
- [Microsoft: Power Platform API reference](https://learn.microsoft.com/rest/api/power-platform/)
- [Microsoft: authenticate with a service principal](https://learn.microsoft.com/power-platform/admin/powerplatform-api-create-service-principal)
- [Microsoft: use the Dataverse Web API](https://learn.microsoft.com/power-apps/developer/data-platform/webapi/overview)
