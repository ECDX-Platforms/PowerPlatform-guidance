---
description: ECDX Power Platform practices: environments, ALM, naming, security and a release checklist
applyTo: "**"
---

# ECDX Power Platform practices

This project follows a set of Power Platform practices. They are guidance rather than rules: apply them
with judgement, follow the reasoning when it applies, and say so when you depart from it.

## The environment sets the bar

Start by establishing where this will run. The environment, not a project size label, decides how
much process applies.

| Target | Managed solution | Version control | Pipeline | Documentation |
| --- | --- | --- | --- | --- |
| Developer environment | No | Recommended | No | None |
| Development sandbox | No | **Required** | No | Light |
| Test, UAT | Yes | Required | Yes | Full |
| Production | Yes | Required | **Mandatory** | **Required** |

Then raise it for two things: **data class** (confidential or personal data never lives in a
developer environment, and brings auditing plus field-level security) and **criticality** (a core
business process adds UAT, a runbook, a named owner, and automated tests).

State the environment and data class you assumed whenever your answer depends on them. Do not apply a
production bar to a developer-environment experiment, or the reverse.

## What tends to work

These are practices, not rules. Apply them with judgement, and say so when you depart from them.

- Build somewhere other than the Default environment. It cannot be governed, and moving components
  out of it later is tedious.
- Unmanaged solutions while building, managed in test and production. Solution layers break the link
  between the repo and what is running, so fixing forward through the pipeline works better than
  editing production.
- Keep the source in the repo. A solution that exists only in an environment is hard to recover and
  hard to prove you own.
- Deploy through the pipeline once more than one person is involved.
- No secrets in solutions, flows, environment variables or app settings. Key Vault plus connection
  references is the pattern that survives an audit.
- Route access and role assignment through Entra ID groups rather than direct user assignment, so
  access is reviewable.
- No hardcoded environment URLs, GUIDs or tenant names. Connection references plus environment
  variables adapt to each environment.
- Naming: publisher prefix `{prefix}_`, environments `{org}-{type}`, flows
  `{TriggerType} | {Scope} | {Action}`.
- Declarative before code: business rules, calculated columns, Power Fx commands and flows ahead of
  plugins, because they are cheaper to change.
- Resolve delegation warnings in canvas apps. They truncate results silently, which looks like
  missing data months later.

## Before you call something done

Walk the checklist items that apply. Report what you found rather than a score: a list of things worth
knowing before release, each with the effect it would have.

| Marker | Applies |
| --- | --- |
| `[build]` | While building, in any environment |
| `[release]` | Before deploying to test, UAT, or production |
| `[prod]` | Before deploying to production |

The checklist is grouped as: solutions and ALM, source and configuration, naming, operability, security and access, data, documentation, and testing.
configuration, 13–15 naming, 16–19 operability, 20–27 security and access, 28–30 data, 31–33
documentation, 34–37 testing. The full checklist is `best-practices/release-checklist.md` in the ECDX repo.

## Silence is not permission

If these practices do not cover your question, say so and name what you decided instead. An
undocumented area is an undecided area, not an unregulated one.

## Where the detail lives

| Topic | File in the ECDX repo |
| --- | --- |
| Environment types, purpose, chains, lifecycle | `best-practices/environments.md` |
| How much process applies | `best-practices/alm.md#how-much-process` |
| Naming for every artifact | `best-practices/naming.md` |
| Identities, roles, groups, DLP, auditing, data classes | `best-practices/security.md` |
| Solutions, complexity, pipelines, documentation | `best-practices/alm.md` |
| Canvas apps, flows, plugins, Code Apps | `best-practices/coding.md` |
| Copilot Studio agents | `best-practices/ai-agents.md` |
| Pre-release checklist and test bar | `best-practices/release-checklist.md` |
| Scope and non-goals | `docs/coverage.md` |
