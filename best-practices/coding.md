---
title: Coding Standards
description: Building rules for canvas apps, Power Automate flows, Dataverse plugins, and Code Apps
type: practice
tags: [canvas-apps, power-fx, flows, plugins, c-sharp, code-apps, csp, efficiency, delegation, accessibility]
last_reviewed: 2026-10-23
---

Cross-cutting rule: **declarative first.** Business rules, calculated and rollup columns, Power Fx
commands, and cloud flows before plugins. Reach for code when the logic must be synchronous,
transactional, or genuinely cannot be expressed declaratively: not because it's the tool you
know best.

## Common failure modes

The patterns that pass review and still break in production. Worth knowing because each one looks
correct when you write it.

| Wrong | Right | Why it breaks |
| --- | --- | --- |
| Environment URL or ID hardcoded in a flow or app | Connection reference plus environment variable | Works in dev, writes to the wrong system in prod |
| Secret typed into an environment variable | Key Vault reference, resolved at runtime | Environment variables are readable by makers |
| Plugin caching data in a static or instance field | Retrieve per execution; stateless class | Shared state across threads under load, failing intermittently |
| `Apply to each` containing a condition that filters | OData `filter` on the list action | Runs the loop over every row to discard most of them |
| App reading a whole table, then filtering in a collection | Delegable `Filter` on the data source | Silently truncates at the delegation limit |
| Try/catch scope that swallows the error | Re-throw or terminate, plus a notification with the run link | Failure becomes invisible until a user reports it |

More on the mechanisms behind these: [plugin state](#plugins-and-workflow-activities),
[delegation](#canvas-apps), and
[environment-specific values](alm.md#environment-variables-and-connection-references).

## Canvas apps

**Formulas and data**

- Write delegation-friendly queries. A delegation warning is worth resolving; it truncates results
  silently and surfaces months later as "some records are missing".
- Fetch only the columns you need (`ShowColumns`, narrow `Filter`). Don't pull whole tables into
  collections.
- Use `With()` and named formulas (`App.Formulas`) instead of repeating a lookup.
- Wrap independent data calls in `Concurrent()`. Keep `OnStart` minimal: it sits on the critical
  path of every session.
- Handle errors visibly: an `IfError` plus `Notify` path beats a control that doesn't respond.

**Structure**

- Reuse components. Split large apps into task-focused apps rather than one monolith.
- Naming: [naming.md](naming.md#apps). Comment *why*, not *what*.

**Before code review**

- App checker and Accessibility checker clean; delegation warnings resolved, not suppressed.
- Profiled with Monitor for excessive data calls: before optimising by guess.
- Accessibility: every input labelled, never colour alone, sensible tab order, keyboard reachable.
- The [Power CAT Toolkit](https://appsource.microsoft.com/product/office/WA200003723) flags coding
  guideline violations automatically; don't read a checklist by hand.

## Flows

Every action costs two compute cycles, engine and API call, even a condition. Efficiency is cost,
speed, and sustainability in one decision.

- Use **filter** instead of conditions inside loops. Only actions affected by the iteration go
  inside a loop; everything else moves out.
- Use **Compose** and **Select** instead of nested loops. Compare stringified values, not
  loop-against-loop.
- Add `$select` to API calls to shrink response bodies. No unnecessary Compose or variable actions.
- Prefer child flows for reuse over one monolith.
- Choose triggers deliberately: **trigger conditions** stop a flow starting only to fail a
  first-step condition. Polling every minute for a daily event burns quota for nothing.
- Handle failure explicitly: try/catch scope pattern plus a notification with the failed-run link
  ([release checklist](release-checklist.md#operability)).
- Always solution-scoped. No personal flows in a shared environment ([naming](naming.md#flows)).

## Plugins and workflow activities

Scaffold with `pac plugin init` rather than by hand, so the target framework and the sandbox-compatible
`Microsoft.CrmSdk.CoreAssemblies` reference are correct from the start.

- Implement `IPlugin` as stateless. Instance members are a thread-safety bug waiting for load.
- No batch requests (`ExecuteMultipleRequest`, `ExecuteTransactionRequest`) inside plugins.
- No parallel or multi-threaded execution inside plugins or custom workflow activities.
- Don't duplicate step registration. Duplicates fire the logic multiple times and the failures look
  intermittent.
- Raise errors with `InvalidPluginExecutionException`; log through `ITracingService`.
- Set an explicit `Timeout` and `KeepAlive = false` on outbound HTTP calls.
- Merge plugins into one assembly while comfortably under sandbox size limits; split when near them.

## Dataverse data access

Applies everywhere, not just in plugins:

- Respect [service protection API limits](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits).
  Honour `Retry-After` instead of retrying tighter.
- Request specific columns in every query. `AllColumns` returns far more than you need.
- Batch bulk create and update within limits; drop redundant round trips.
- Strip invalid characters before writing to string fields.
- Retrieve **published** metadata only; unpublished adds overhead and can return surprises.

## Code Apps

Choose them for a long lifecycle, high complexity, and a team with React and JS skills: not for
short-lived internal tools ([choosing an app type](../docs/choosing-app-type.md)).

- Disabled by default; keep it that way. Enable per environment in PPAC → Environments → Settings →
  Product → Features → Power Apps code apps, and scale through environment groups.
- Build with the **Power Apps CLI (`pa`)**, not `pac`: `pa app init`, `pa app run`, `pa app add
  data-source`, `pa app push`. Code apps are the only thing `pa` does
  ([dev-setup/vscode.md](../dev-setup/cli.md#installing-pa)).
- End users need **Power Apps Premium** licences.
- Source lives in the repo. Transpiled output can't be edited back, so the repo is the only real
  artifact.
- Deploy from the repo to test and prod by someone other than the developer, after review and
  scanning. The maker flow does not apply.
- CSP is the security boundary ([security.md](security.md#content-security-policy)): `connect-src`
  is your DLP for fetch calls, `script-src` is remote code execution. Prefer connectors over raw
  fetch: DLP coverage, authentication handled, no secrets in code.

## References

- [Power Apps coding guidelines](https://learn.microsoft.com/power-apps/guidance/coding-guidelines/overview) · [delegation overview](https://learn.microsoft.com/power-apps/maker/canvas-apps/delegation-overview)
- [Best practices for plug-in and workflow development](https://learn.microsoft.com/power-apps/developer/data-platform/best-practices/business-logic/) · [API limits](https://learn.microsoft.com/power-apps/developer/data-platform/api-limits)
- [Power Apps code apps](https://learn.microsoft.com/power-apps/developer/code-apps)
- [Power Automate coding guidelines](https://learn.microsoft.com/power-automate/guidance/coding-guidelines/) · [Power Apps coding guidelines](https://learn.microsoft.com/power-apps/guidance/coding-guidelines/overview)
- [Microsoft: app performance and data limits](https://learn.microsoft.com/power-apps/maker/canvas-apps/delegation-overview)
- [Microsoft: enable and configure code apps](https://learn.microsoft.com/power-apps/developer/code-apps)
