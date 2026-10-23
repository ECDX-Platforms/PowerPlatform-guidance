---
name: walk-release-checklist
description: Use before releasing a Power Platform solution, when auditing one already in production, or when reviewing someone else's work. Walks the ECDX release checklist that applies to the target environment and criticality, reporting what you found and what it would cost. Activate for "is this ready to ship", "review this solution", "what is missing before release", "run the checklist", or "audit this environment".
---

# Walk the release checklist

A checklist, not a score. A failed item is a decision to make, not a number to improve.

This list mirrors `best-practices/release-checklist.md`. When that page changes, change this one; a
package is deployed into another repo, so it cannot link back here.

## Establish scope first

1. Determine the **target environment**: developer, dev sandbox, test, UAT, or production. If that is
   unclear, run the `assess-change-risk` skill first.
2. Note what **data class** it touches, and whether anything about it is irreversible.
3. Load the checks whose markers apply:

| Marker | Applies |
| --- | --- |
| `[build]` | While building, in any environment |
| `[release]` | Before deploying to test, UAT, or production |
| `[prod]` | Before deploying to production |

A developer-environment experiment legitimately has almost nothing to check. Do not invent work for
it, and do not silently skip a `[release]` check because the target was vague.

## The checks

**Solutions and ALM**

- `[build]` Components live in an unmanaged solution in dev, not in the default solution
- `[build]` A custom publisher is in use, rather than the default `new_` or CDS publisher
- `[build]` Components are split into solutions, with developer isolation where it helps
- `[build]` Test and prod hold managed solutions; only environment variable values and connection references are unmanaged
- `[build]` The change came through the chain rather than straight into production
- `[build]` Solution Checker has been run, and there are no critical or high findings left unexplained
- `[prod]` Deployed by the pipeline service connection, with a human approving

**Source and configuration**

- `[build]` Unmanaged solution files are exported and committed. Essential from the shared dev sandbox onward; optional in a personal developer environment
- `[build]` The source is somewhere the organisation controls, not a vendor tenant or a personal drive
- `[build]` Connection references point at the right target system in each environment
- `[build]` Environment variables hold configuration and no secrets
- `[build]` No hardcoded URLs, GUIDs or tenant names

**Naming**

- `[build]` Tables and subcomponents are named for what they are, and display and schema names agree
- `[build]` Screens, controls and variables follow the prefixes in `naming.md`
- `[build]` Flows, apps, agents and solutions follow their patterns

**Operability**

- `[build]` Flows handle failure: try/catch, and a notification to a real person with the failed-run link
- `[build]` Canvas apps surface errors rather than failing silently
- `[release]` Logs go somewhere a person actually looks
- `[release]` A named owner exists and knows it

**Security and access**

- `[release]` Environment access comes from an environment security group rather than direct user adds
- `[build]` Security roles are assigned to Entra group teams rather than to users
- `[build]` The narrowest role that works is in use, and it has been reviewed since the last change
- `[prod]` A service account or SPN owns the components in test and prod
- `[release]` Tenant isolation is on, inbound and outbound
- `[release]` DLP has been checked for this environment and the connectors in use are approved
- `[release]` Auditing is on where the data warrants it, with retention agreed
- `[prod]` The Managed Security features have been decided, not defaulted

**Data**

- `[build]` The data class is agreed (see the data classification table in `security.md`) and the controls for it are in place
- `[build]` Sensitive columns have field-level security
- `[release]` Retention and deletion behaviour is deliberate rather than whatever the default was

**Documentation**

- `[build]` Light documentation exists: owner, audience, user count, purpose, components, data sources
- `[release]` PDD and SDD are in the repo and current as of this release
- `[release]` A runbook says what breaks, who to call, and how to roll back

**Testing**

- `[build]` The smoke checklist has been run, including permissions and data boundaries
- `[release]` Regression against production-like data, run by someone who did not build it
- `[prod]` Automated tests run in the pipeline
- `[release]` UAT evidence is recorded and attached to the release

## How to check, not guess

A check you cannot verify from what you were given is **unverified**, not passed. Ask for the
evidence, or state that you could not check it and why. Then:

- Check the artifact, not the description of it. Open the export, read the connection reference
  target, list the role assignments.
- Where a check needs a human (an owner "knowing they own it"), ask rather than assume.
- The two items that catch the most real damage are connection references pointing at the wrong
  environment (which writes production data into the wrong place) and direct role assignment (which
  makes access untraceable).

## Report

One line per item, in this shape:

```
FAIL: connection reference "cr_portal_dataverse" points at {org}-test in the prod export
UNVERIFIED: no access to role assignments in {org}-prod
PASS: PDD and SDD present, updated 2026-10-14
```

Then summarise: how many failed, how many unverified, and the two or three that actually block
release. Do not pad the summary with passes. If everything applicable passes, say so in one line.
