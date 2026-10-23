---
title: <Project Name> PDD
description: "Product design document template: the problem, the users, and what done means"
type: template
---

# <Project Name> product design

The PDD answers *what are we building and why*. The [SDD](sdd-template.md) answers *how*. Fill this
in before the build starts, because it is the document that tells you whether the build is finished.

Keep it to a page or two. A PDD nobody updates is worse than none, because it looks authoritative.

## Problem

<What is wrong today. One paragraph, in business language, with a number in it if you have one
("four hours a week reconciling X" beats "the process is inefficient").>

## Users and audience

| Who | How many | What they do with it |
| --- | --- | --- |
| <role> | <number> | <task> |

## Data

| Question | Answer |
| --- | --- |
| Data classes handled | <public / internal / confidential / personal or regulated> |
| Which specific fields are sensitive | <columns> |
| Where it comes from | <system or list> |
| Retention | <how long, then what happens> |
| Legal or contractual constraint | <or "none identified"> |

If anything here is confidential or personal, say which environment chain it requires. That decision
is made now, not later.

## Requirements

Must have, in the user's words. Each one testable.

- [ ] <requirement>
- [ ] <requirement>

Explicitly out of scope, so nobody assumes it:

- <not doing this>
- <nor this>

## Acceptance criteria

What has to be true for the business to call this done. These become the UAT script.

| # | Criterion | How it will be checked |
| --- | --- | --- |
| 1 | <criterion> | <manual step or test> |
| 2 | <criterion> | <manual step or test> |

## Criticality

| Question | Answer |
| --- | --- |
| Is this a core business process? | <yes / no> |
| If it stopped for a day, what happens? | <the business stops, or people are inconvenienced> |
| Business owner who agreed to that | <name and role> |

Answer honestly. The answer decides whether UAT, a runbook and a separate system owner are required.

## Non-functional requirements

Fill in the ones that apply, and delete the rest. "None" is a valid answer; blank is not.

| Requirement | Statement |
| --- | --- |
| Volume | <records per day, peak concurrency> |
| Performance | <acceptable wait for the main action> |
| Availability | <hours it must be up> |
| Accessibility | <standard, or "baseline platform behaviour"> |
| Auditing | <what must be traceable, for how long> |

## Success measure

<How you will know in three months whether this was worth building.>

## Sign-off

| Role | Name | Date |
| --- | --- | --- |
| Business owner | | |
| Solution owner | | |

## Related

- [SDD](sdd-template.md): how it will be built
- [release checklist](../../best-practices/release-checklist.md): the documentation item covers this and the SDD
- [How much process](../../best-practices/alm.md#how-much-process): what else the environment and data class require
