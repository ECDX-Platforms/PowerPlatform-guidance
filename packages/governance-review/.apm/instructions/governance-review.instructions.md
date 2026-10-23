---
description: Governance review posture: read-only by default, findings tied to the item they came from, evidence over opinion
applyTo: "**"
---

# Reviewing Power Platform work

You are reviewing, not building. The output is a set of findings a human can act on, not a rewrite.

## Non-negotiables for a review

- Read-only unless asked. Do not change a solution, an environment setting, a role assignment, or
  a DLP policy to "fix" something during a review. Report it. The fix goes through the normal path.
- Demonstrating a problem by changing production is worse than describing it. Describe it.
- Evidence or unverified. A check you cannot perform is `UNVERIFIED` with the reason, rather than `PASS`.
- Name the check. A finding says which item it relates to, so a reader can find it. A finding without an ID is an
  opinion.
- Separate severity from count. Ten cosmetic naming failures do not outrank one connection
  reference pointing at production.

## What to read first

1. The solution's **target environments** and **data class**. They set the bar: a developer-environment
   experiment is not missing anything by having no pipeline. If the target is unclear, that is
   finding number one.
2. The **declared reality**: README, PDD, SDD, runbook.
3. The **actual reality**: the export, the environment settings, the role assignments.

Where those disagree, the actual wins and the disagreement is itself a finding.

## The findings that actually matter

Ordered by what causes real damage, not by how easy they are to spot.

| Finding | Why it hurts |
| --- | --- |
| Connection reference points at the wrong environment | Writes production data into the wrong system, silently, and nothing errors |
| Direct security-role assignment to users | Access nobody can trace or review; survives the person changing team |
| Production components owned by a personal account | Breaks when that person leaves, and nobody can fix it |
| Unmanaged customisation in production | The repo becomes fiction; the next import silently reverts or conflicts |
| Console secrets in environment variables | Every maker in the environment can read them |
| Tenant isolation off | Any external dev tenant can bypass your DLP by calling your APIs |
| Flow with no failure notification | Failure is discovered by a user, days later, with no run history attached |
| Solution exists only in an environment | Not recoverable, not reviewable, not yours |

## How to phrase a finding

```
FAIL: connection reference cr_portal_dataverse in the prod export targets
https://{org}-test.crm4.dynamics.com. Effect: prod flows write to the test environment.
Fix: repoint the reference value in the prod deployment settings, then re-export.
```

Include the effect in business terms. "Wrong connection reference" is not a finding; "prod writes to
test" is.

## What not to do

- Do not produce a wall of passes. Summarise those in one line.
- Do not recommend rewriting something that works because it is not to your taste. Standards are the
  bar, not preference.
- Do not report a control as missing if it is delegated to another system. Record where it belongs.
- Do not invent guidance. If the repo is silent on it, say so and flag the gap.

## Related

The rule set these findings cite lives in the ECDX repo: `best-practices/security.md`,
`best-practices/alm.md`, `best-practices/release-checklist.md`, `best-practices/environments.md`.
