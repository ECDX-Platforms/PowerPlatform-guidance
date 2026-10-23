---
title: Release Checklist
description: What is worth checking before people depend on a solution, and what each check prevents
type: practice
tags: [release, checklist, review, testing, smoke-tests, regression, playwright]
last_reviewed: 2026-10-23
---

Things worth checking before people depend on a solution, and again when looking at something already
live. Not a stage anyone has to pass: a list to think against, and to prune.

A tick means someone looked. A dash means it did not apply. Both are fine; a blank is the only
unhelpful answer.

Scope markers:

| Marker | Applies |
| --- | --- |
| `[build]` | While building, in any environment |
| `[release]` | Before deploying to test, UAT, or production |
| `[prod]` | Before deploying to production |

Skip what does not apply. The useful outcome is knowing which items you decided were unnecessary and
why, not a clean sheet.

## Solutions and ALM

- [ ] **[build]** Components live in an unmanaged solution in dev, not in the default solution
- [ ] **[build]** A custom publisher is in use, rather than the default `new_` or CDS publisher
- [ ] **[build]** Components are split into solutions, with developer isolation where it helps
- [ ] **[build]** Test and prod hold managed solutions; only environment variable values and connection references are unmanaged
- [ ] **[build]** The change came through the chain rather than straight into production
- [ ] **[build]** Solution Checker has been run, and there are no critical or high findings left unexplained
- [ ] **[prod]** Deployed by the pipeline service connection, with a human approving

## Source and configuration

- [ ] **[build]** Unmanaged solution files are exported and committed. Essential from the shared dev sandbox onward; optional in a personal developer environment
- [ ] **[build]** The source is somewhere the organisation controls, not a vendor tenant or a personal drive
- [ ] **[build]** Connection references point at the right target system in each environment
- [ ] **[build]** Environment variables hold configuration and no secrets
- [ ] **[build]** No hardcoded URLs, GUIDs or tenant names

## Naming

- [ ] **[build]** Tables and subcomponents are named for what they are, and display and schema names agree
- [ ] **[build]** Screens, controls and variables follow the prefixes in [naming.md](naming.md#apps)
- [ ] **[build]** Flows, apps, agents and solutions follow their patterns

## Operability

- [ ] **[build]** Flows handle failure: try/catch, and a notification to a real person with the failed-run link
- [ ] **[build]** Canvas apps surface errors rather than failing silently
- [ ] **[release]** Logs go somewhere a person actually looks
- [ ] **[release]** A named owner exists and knows it

## Security and access

- [ ] **[release]** Environment access comes from an environment security group rather than direct user adds. Not applicable to developer or default environments, which do not support them
- [ ] **[build]** Security roles are assigned to Entra group teams rather than to users
- [ ] **[build]** The narrowest role that works is in use, and it has been reviewed since the last change
- [ ] **[prod]** A service account or SPN owns the components in test and prod
- [ ] **[release]** Tenant isolation is on, inbound and outbound
- [ ] **[release]** DLP has been checked for this environment and the connectors in use are approved
- [ ] **[release]** Auditing is on where the data warrants it, with retention agreed
- [ ] **[prod]** The Managed Security features have been decided, not defaulted

## Data

- [ ] **[build]** The data class is agreed ([security.md](security.md#data-classification)) and the controls for it are in place
- [ ] **[build]** Sensitive columns have field-level security
- [ ] **[release]** Retention and deletion behaviour is deliberate rather than whatever the default was

## Documentation

- [ ] **[build]** Light documentation exists: owner, audience, user count, purpose, components, data sources
- [ ] **[release]** PDD and SDD are in the repo and current as of this release
- [ ] **[release]** A runbook says what breaks, who to call, and how to roll back

## Testing

- [ ] **[build]** The smoke checklist has been run, including permissions and data boundaries
- [ ] **[release]** Regression against production-like data, run by someone who did not build it
- [ ] **[prod]** Automated tests run in the pipeline
- [ ] **[release]** UAT evidence is recorded and attached to the release

Evidence lives in the repo next to the solution, not in someone's memory of a demo.

| Going into | Test evidence worth having |
| --- | --- |
| Developer environment | Nothing |
| Development sandbox | Smoke checklist |
| Test, UAT | Smoke plus regression against production-like data, by someone who didn't build it |
| Production (core process) | All of the above, plus automated tests in the pipeline |

**Smoke checklist**: per app, kept in the repo: the paths a user takes on a normal day end to end;
a user in each role sees what they should and nothing more; the right environment's data is touched.
That last check is what catches a miswired connection reference, which is otherwise invisible until
it corrupts something.

**Regression**: the smoke set against a copy of production-like data. Volume and edge cases reveal
what a clean dev dataset hides.

**Automated**: unit-test C# plugin and business logic before merge, keeping pure logic separate
from platform calls so it's testable without Dataverse. For end-to-end and UI regression use
[Playwright](https://playwright.dev/docs/auth), Microsoft's recommended tool for app testing: one
spec per feature, `getByRole`/`getByLabel` rather than CSS selectors, and authenticate once per
suite through storage state instead of logging in per test.

Testing your own work tends to confirm what you expected rather than find what you missed, so a second
pair of eyes earns its place. Users rarely report security bugs, so somebody has to look for those on
purpose. Agents benefit from a scripted prompt set the same way an app benefits from a smoke test
([ai-agents.md](ai-agents.md#testing)).

## Related

- [alm.md](alm.md#how-much-process) · [environments.md](environments.md) · [security.md](security.md) · [coding.md](coding.md)
