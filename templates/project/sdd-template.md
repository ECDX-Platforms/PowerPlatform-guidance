---
title: <Project Name> SDD
description: Solution design document template: components, data model, security, environments, and how it is operated
type: template
---

# <Project Name> solution design

The SDD answers *how it is built and how it runs*. The [PDD](pdd-template.md) answers *what and why*.

Write it as you build, not after. Its job is to let someone else change this in two years, and to let
a reviewer see the design before release rather than the accident after it.

## Shape

| | |
| --- | --- |
| Environments | <`{org}-dev` → `{org}-test` → `{org}-prod`, or the actual chain> |
| Publisher and prefix | <publisher name and prefix, e.g. `contoso_`> |
| Solutions | <solution names, and what each contains> |
| App type | <canvas / model-driven / code app / none, i.e. automation only> |
| Managed Environments | <yes / no, and why> |

## Components

| Component | Type | Purpose | In solution |
| --- | --- | --- | --- |
| <name> | table / app / flow / agent / plugin / web resource | <one line> | <solution name> |

Everything the solution needs belongs inside it, except custom connectors and shared tables, which
have a different lifecycle. List those exceptions here explicitly.

## Data model

| Table | Schema name | Why it exists | Auditing |
| --- | --- | --- | --- |
| <name> | `<prefix>_<Name>` | <purpose> | <on / off, and why> |

Relationships worth naming, and the reason for each. If a relationship crosses solutions, say so.

## Where the logic lives

For each significant rule, name the mechanism and why. Use
[choosing where logic lives](../../docs/choosing-component.md); the reviewer will check this table
against the build.

| Rule | Mechanism | Why this one |
| --- | --- | --- |
| <rule> | <business rule / calculated column / low-code plug-in / JavaScript / flow / plug-in> | <why it needs to be server-side, or why it does not> |

Note any mechanism that is in preview, and what happens if it never ships.

## Integrations

| Direction | Target | Trigger | Auth | Failure handling |
| --- | --- | --- | --- | --- |
| Inbound | <system> | <how> | <identity> | <what happens when it fails> |
| Outbound | <system> | <how> | <identity> | <retry, alert, dead letter> |

Outbound calls never happen inside a synchronous server step. If one does, say why here.

## Security

| Concern | Decision |
| --- | --- |
| Environment security groups | <names> |
| Security roles | <role, and which group team holds it> |
| Field-level security | <columns, and who is restricted> |
| Owner in test and prod | <service account name> |
| DLP | <policy in scope, connectors needed> |
| Tenant isolation | <applies, with which partners whitelisted> |

## Configuration

| Setting | Dev | Test | Prod |
| --- | --- | --- | --- |
| <environment variable or connection reference> | <value or target> | <value or target> | <value or target> |

No secrets in this table. Reference the Key Vault entry by name.

## Failure modes

What breaks, how you would know, and what the person on call does. This section is the runbook in
outline; expand it if the solution is a core business process.

| Failure | Symptom | Response |
| --- | --- | --- |
| <connection reference misconfigured> | <writes fail or go to the wrong environment> | <repoint and re-export> |

## How it is tested

| Level | What it covers | Where |
| --- | --- | --- |
| Smoke | <the paths a user takes on a normal day> | <checklist location> |
| Regression | <what needs production-like data> | <location> |
| Automated | <what the pipeline runs> | <location> |

See the [release checklist](../../best-practices/release-checklist.md) for what to check, and
[testing](../../docs/testing.md) for the method.

## Open decisions

| Decision | Options | Owner | Needed by |
| --- | --- | --- | --- |
| <decision> | <a / b> | <name> | <date> |

Keep this section. A design document with no open questions is either finished or not being read.

## Related

- [PDD](pdd-template.md): the problem and the users
- [alm.md](../../best-practices/alm.md#documentation): what "full documentation" requires
- [security.md](../../best-practices/security.md): the rules behind the security table
