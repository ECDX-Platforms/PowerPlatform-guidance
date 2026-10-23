---
name: assess-change-risk
description: Use when planning a Power Platform change, or when an existing solution starts to matter more than it used to. Works out which environment it belongs in, what class of data it touches, and therefore which controls apply. Activate for "what process applies", "how much ALM do we need", "can we skip documentation", "is this critical", or before any Power Platform scaffolding.
---

# Assess change risk

There is no "size of project" taxonomy to slot work into. Two things decide what applies: **where it
runs** and **what it touches**.

## 1. Where does it run?

The environment sets the minimum bar. Establish the target before anything else.

| Target | Managed solution | Version control | Pipeline | Documentation | Owner |
| --- | --- | --- | --- | --- | --- |
| Developer environment | No | Recommended | No | None | The maker |
| Development sandbox | No | **Required** | No | Light | The maker |
| Test, UAT | Yes | Required | Yes | Full | Service account |
| Production | Yes | Required | **Mandatory** | **Required** | Service account |

If someone cannot name the target environment, that is the first thing to resolve. "We'll work it
out later" reliably ends in a non-production environment becoming load-bearing.

## 2. What does it touch?

| Data class | Effect |
| --- | --- |
| Public, internal | Nothing extra. A developer-environment experiment needs no ceremony |
| Confidential | Named owner outside IT, auditing on, a retention position someone will defend |
| Personal / regulated | Field-level security on the sensitive columns, plus a review of what any AI feature or external connector does with the data |

Never Confidential or above in a developer environment or the Default environment. If the data is
confidential, the work moves to a shared chain before it starts, not after.

## 3. Is it a core business process?

Ask what happens if it stops for a day. If the answer is "real disruption" rather than
"inconvenience", add:

- UAT with business sign-off, not just testing by the builders
- A runbook: what breaks, who to call, how to roll back
- A named system owner, distinct from the person who built it
- Automated tests in the pipeline

Complexity is a poor proxy for this. A simple flow that prices loans is more critical than a
complicated app nobody uses.

## 4. State the consequences

Report plainly:

```
Target: production ({org}-prod)
Data: confidential, e.g. customer contracts
Core process: yes
Therefore: managed solution, pipeline with approval, service account owner, PDD + SDD,
           runbook, UAT sign-off, automated regression
```

Then name what you had to assume and anything that should change before work starts. The most useful
sentence in a review is usually **"this is being built as an experiment but it is already
load-bearing"** or the reverse.

## Growing into the bar

When something stops fitting its environment, **promote it**: do not let it grow where it is:

1. Move it into the chain the new target requires.
2. Retrofit the missing controls: version control, ownership, documentation, testing.
3. Retire the old copy so two versions cannot drift.

Adding documentation and leaving the artifact in a developer environment is the failure mode, not the
fix.
