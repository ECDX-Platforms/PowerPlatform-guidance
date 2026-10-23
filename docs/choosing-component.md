---
title: Choosing Where Logic Lives
description: "Decision guide for implementing business logic in Dataverse: business rule, calculated or rollup column, low-code plug-in, JavaScript, command, cloud flow, or C# plug-in"
type: guide
tags: [business-rules, plugins, javascript, power-automate, calculated-columns, rollup, power-fx, custom-api, decision]
last_reviewed: 2026-10-23
---

Every mechanism below can produce the same visible outcome. They differ in where the code runs, and
that single fact decides whether it is enforced, how fast it is, and what it costs.

**This comparison is ours.** Microsoft publishes no decision tree or comparison table spanning these
mechanisms, so treat the structure here as team judgement and the individual facts as sourced from
Microsoft Learn, cited at the bottom. Where Microsoft's own documentation conflicts, it is flagged
rather than smoothed over.

## The question that decides it

Ask in this order. The first answer that holds wins, and you stop.

1. **Must it hold for every write, whoever writes it?** API, import, bulk edit, another app, a
   flow. If yes, it has to be server-side. Client-side code is a convenience, not a control.
2. **Must it be part of the save, or can it happen after?** Part of the save means server-side and
   synchronous. After is fine for anything that touches the outside world.
3. **Does it need to reach a system outside Dataverse, or take longer than a couple of minutes?**
   Then it is asynchronous, full stop. Synchronous work holds a database transaction open and there
   is a hard limit on that.
4. **Is it a UI concern only?** Then it belongs in the form, and nothing else needs to know.

Only then pick a mechanism. Choosing the tool first and testing whether it happens to enforce your
rule is how client-side validation ends up in production as if it were a constraint.

## Three places logic can run

| Runs at | Transactional with the save | Reached by every write path | Mechanisms |
| --- | --- | --- | --- |
| **Client** (form, browser) | No | **No** | Business rule (form scope), JavaScript web resource, Power Fx command, PCF |
| **Server** (Dataverse event pipeline, at save time) | Yes | **Yes**, for the rules that trigger: table-scope business rules, low-code plug-ins, C# plug-ins |
| **Computed or invoked** | Only when called | **No** | Calculated and rollup columns are values, not rules. A custom API runs when something calls it |
| **Detached** (async or scheduled) | No | Triggered by the change, but not part of it | Power Automate cloud flow, background workflow, async plug-in |

A failure in a client-side rule leaves the data wrong. A failure in a synchronous server step rolls
the save back. That difference is the whole reason to care.

## Comparison

Short answers first. The caveats that actually change a decision are underneath, because they do not fit
in a cell and a paragraph in a table is not readable.

| Mechanism | Runs at | Inside the save? | Every write? |
| --- | --- | --- | --- |
| Business rule, form or All Forms scope | Client | No | No |
| Business rule, Entity scope | Client and server | Yes, server copy | Documented yes; test it |
| Calculated column | Read time | No | n/a |
| Rollup column | Scheduled | No | n/a |
| Low-code plug-in (Power Fx) | Server, real time | Yes | Yes |
| JavaScript web resource | Client | No | No |
| Power Fx command | Client, on click | No | No |
| Power Automate cloud flow | Detached | No | Via the trigger |
| Classic workflow | Detached, or server if real time | Real time only | Real time only |
| C# plug-in | Server | Yes, when synchronous | Yes |
| Custom API | When called | Only if called synchronously | No |
| Azure Function | Outside Dataverse | Only if a step waits on it | No |
| PCF code component | Client | No | n/a |

**Business rules.** Form and All Forms scope compile to JavaScript, and that is the only scope with
requirement levels, show/hide, enable/disable and recommendations. Entity scope also compiles a
server-side copy as a synchronous plug-in. Microsoft supports up to 150 rules per table across both
scopes and warns that performance degrades past that; it is a ceiling you regret rather than one the
platform enforces. See the warning below about whether Entity scope really blocks an API write.

**Calculated and rollup columns** are values, not rules. A calculated column is computed when the record
is read, from the same record and its many-to-one parents, and can chain through another calculated
column up to five deep, after which sorting is disabled. A rollup is recalculated on a schedule, with a
minimum recurrence of an hour, so treat the number as possibly stale rather than as a current total.

**Low-code plug-ins** are in preview and Microsoft's preview terms say preview features are not for
production use. The "instant" variant is being superseded by Functions, also in preview.

**JavaScript and Power Fx commands** run in the browser only. Nothing on the server knows they exist,
so neither can be the only place a rule lives. A command also only runs when someone presses it.

**Cloud flows** run after the operation, never inside it, and a flow failure does not roll the save
back. That is the point of them, and also why they are the wrong tool for an invariant.

**Classic workflows** are not deprecated. Microsoft recommends cloud flows for new work and publishes no
removal date.

**C# plug-ins** have four stages but only three are generally registerable, and asynchronous execution
happens only at post-operation. The whole message operation must complete within two minutes, and the
design target is two seconds. An exception thrown inside the transaction rolls the whole thing back;
one thrown earlier, before the transaction opens, does not.

**Custom APIs** package a message, usually with a plug-in class behind it but not necessarily. They
enforce nothing by existing: if nothing calls one, nothing happens.

**Azure Functions** are outside Dataverse and are not a write hook. Whether a call blocks the save
depends entirely on how you invoke it, and a synchronous call that waits for a function is the pattern
to avoid.

**PCF components** are controls, not places to put business logic.

## One warning you need before trusting that table

**Microsoft's documentation contradicts itself on Entity-scope business rules.** The scope table on
the business rule page says Entity scope applies to "model-driven app forms and server", and the
150-rule limit is described as covering "server side (XAML generated as synchronous plugins)". But the
FAQ on the *same page* says "Business rules are run on clients... They aren't executed inside
Dataverse."

So the honest position: Entity scope is documented as running server-side, and if it does, it blocks a
write that fails validation and server-side-only actions are ignored rather than erroring. Do not bet
data integrity on it until you have tested it once against your own environment with a Web API
create or update that violates the rule. If that test shows the record saved, the rule is UI-only in
practice and belongs in a low-code plug-in or a C# plug-in instead.

This is the one place in this guide where you should trust a five-minute experiment over the
documentation.

## Picking one

Most of the time the answer is the cheapest thing that reliably holds. In order:

**A column if the value is derivable.** Calculated for same-record or parent values, rollup for
aggregates over children. No code, no maintenance, and it works for every consumer. Accept the
staleness a rollup brings, or recalculate on demand.

**A table-scope business rule if the rule is a condition.** "End date must be after start date."
"Closing a case requires a resolution." Table scope, not form scope, because form scope is a
suggestion. Watch the 150-per-table ceiling; a table with 200 business rules is slower on every save
and nobody can say why.

**A Power Fx low-code plug-in if it is a simple server-side computation or validation** that business
rules cannot express. It is in preview, and Microsoft's own preview terms say preview features are not
for production use, so this is a poor place to put an invariant you actually depend on. Reach for it for
convenience, not for a control.

**A cloud flow if it leaves Dataverse.** Sending mail, calling an API, writing to SharePoint, or a
job that takes minutes. Flows are the right tool precisely because they are not part of the save.

**A C# plug-in only when the alternatives genuinely fail.** You need synchronous server logic that
Power Fx cannot express, precise pipeline control, transactions across tables, or performance that a
flow cannot meet. It is the most capable and the most expensive thing to own: compiled, versioned,
unit-tested, and it blocks the save while it runs. A synchronous exception at any stage rolls the
whole transaction back, which is the feature and also the risk.

**A custom API when the logic needs to be callable** from more than one place: client code, a flow, and
another plug-in, all using the same contract. It is packaging rather than enforcement, so do not reach
for it expecting it to fire on its own.

**JavaScript when the problem is the form.** Showing and hiding fields, reacting to what the user
is doing, calling the client API. Never as the only place a rule exists.

## The traps

A form-scope business rule and a JavaScript check are both bypassed by a Web API call, so
client-side validation is a convenience and never a constraint. If the data must be right, the rule
goes server-side.

Synchronous work that calls out to another system holds a transaction open and will meet the timeout
under load. Outbound calls belong in an asynchronous step or a flow.

Business rules are the most readable option until there are eighty of them, ordered in ways nobody
can reconstruct, some form-scoped and some table-scoped. Treat a hundred on one table as a smell.

A rollup is not a current total. Anything that depends on the number being exact at the moment of
saving is a validation rule, not a rollup.

Dataverse-triggered flows run after the operation and can overlap. If order matters, that is a
server-side problem and a flow cannot solve it.

And the most common one: the same validation in a business rule, a plug-in and a flow. Three places
to change, one place to forget.

## Testability

| Mechanism | How you test it |
| --- | --- |
| Business rule (form scope) | By hand, in a form. No automated test story |
| Business rule (table scope) | Create or update a record through the Web API and assert the outcome. It is a server-side rule, so it can be tested like one |
| Calculated, rollup | By hand. Verify the formula against known data |
| Low-code plug-in | A Test button that runs it and shows output. Trigger-and-observe, not a test |
| JavaScript | Extract the pure logic and unit-test it. Form wiring is manual |
| Cloud flow | Run history, plus a test trigger. Check every branch |
| C# plug-in | Unit tests against a mocked pipeline. Dataverse ships no test framework; the mocking library people use, FakeXrmEasy, is community and unsupported |

If a rule is important enough to argue about, it is important enough to have a test. That pushes
you toward the server-side options and toward keeping logic in pure functions whatever the
mechanism.

## Related

- [choosing-app-type.md](choosing-app-type.md): canvas, model-driven, or Code App
- [coding.md](../best-practices/coding.md): the rules the chosen mechanism still has to meet
- [release-checklist.md](../best-practices/release-checklist.md): what to verify before release
- [alm.md](../best-practices/alm.md#where-the-truth-lives): why every one of these belongs in a solution

## Sources

- [Business rules in Dataverse](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-create-business-rule)
- [Low-code plug-ins (preview)](https://learn.microsoft.com/power-apps/maker/data-platform/low-code-plug-ins)
- [Define rollup columns](https://learn.microsoft.com/power-apps/maker/data-platform/define-rollup-fields)
- [Custom API](https://learn.microsoft.com/power-apps/developer/data-platform/custom-api)
- [Event framework and pipeline stages](https://learn.microsoft.com/power-apps/developer/data-platform/event-framework)
