---
title: Testing
description: "How to test Power Platform work: what each level covers, where evidence lives, and how to test things that resist automation"
type: guide
tags: [testing, smoke, regression, playwright, uat, evidence, plugins]
last_reviewed: 2026-10-23
---

The bar is in [release-checklist.md](../best-practices/release-checklist.md). This page is the method: what each
level actually covers, where the evidence goes, and how to test the parts of this platform that
resist automation.

## What each level covers

| Level | Covers | Catches |
| --- | --- | --- |
| Smoke | The paths a user takes on a normal day, per role | A broken deploy, a missing component |
| Regression | The smoke set plus volume and edge cases against production-like data | What a small dev dataset hides |
| Automated | Logic that can run without a browser | Regressions in plugins, calculations, integrations |
| UAT | The acceptance criteria in the PDD | Building the wrong thing correctly |

A smoke checklist lives in the repo next to the solution, as a checklist. Three sections: the happy
path, one pass per role, and the data boundary check.

## The data boundary check

The one check people skip and then regret. Confirm that the environment you are in talks to the
system you think it does.

1. Open the record from the deployment you are testing.
2. Follow it into whatever it writes, reads or emails.
3. Confirm the destination is the matching environment, not a neighbouring one.

A connection reference pointed at the test environment from production writes to the wrong system
without raising an error, which is why this is the highest-damage failure on the platform and why
the release checklist has an item for it.

## Testing each mechanism

Most of this platform resists automated testing, and pretending otherwise produces test suites nobody
runs. Be explicit about which level you are relying on.

**C# plugins.** The only mechanism with real unit testing. Dataverse ships no test framework; the
mocking library people use, FakeXrmEasy, is community and unsupported, which you should know before
making it a build dependency. Keep the logic in pure functions and most of the test suite needs no
mock at all.

**Business rules (Entity scope).** Server-side, so testable: create or update a record through the Web
API and assert the outcome. First confirm it actually blocks the write in your environment, because
Microsoft's own documentation is inconsistent on that point
([choosing-component.md](choosing-component.md#one-warning-you-need-before-trusting-that-table)).

**Business rules (form scope), JavaScript, Power Fx commands.** Client-side, so only manual. Extract
the pure logic into a function and unit test that; test the wiring by hand.

**Calculated and rollup columns.** Verify the formula against known data by hand. A rollup is
asynchronous, so a test that saves and immediately reads the total will fail intermittently. Wait for
the recalculation or force it before asserting.

**Cloud flows.** Run history plus a deliberate failure. Check every branch, including the one you
think cannot happen. Confirm the failure notification reaches a real person, because a flow that
fails silently is not tested by a green run.

**Agents.** A scripted set of prompts with expected behaviours, run against the release. Record the
answers. An agent with no prompt set is an agent nobody has checked.

## End-to-end tests

[Playwright](https://playwright.dev/docs/auth) is Microsoft's recommended tool for app testing.

- Target user-visible behaviour: `getByRole`, `getByLabel`. Not CSS selectors, which encode layout.
- Authenticate once per suite through storage state, not per test. A suite that signs in for every
  case runs for minutes and fails for reasons unrelated to the app.
- One spec per feature, and suites that do not depend on each other's order. Order-dependent
  tests fail for reasons that have nothing to do with the app.
- Model-driven and canvas apps are slow to render. Wait on a specific element, never on a timer.

Where it is worth the cost: form-driven processes with real users and a stable UI. Where it is not:
a personal automation, or a solution still changing shape weekly.

## Evidence

UAT evidence is recorded and attached to the release, not summarised from memory afterwards.

- UAT: the acceptance criteria from the PDD, each marked pass or fail, with a date and who checked it.
- Smoke: the checklist, filled in, with the environment recorded.
- Regression: what data was used, and the result.
- Automated: the pipeline run.

Store it with the solution, in `docs/`. A screenshot in a chat message is not evidence, because it
cannot be found later.

## Who tests

Testers are independent of the builders. Testing your own work confirms what you expected; it does not
find what you missed. Users will not find security bugs either, so somebody has to look for those
deliberately.

## Related

- [release-checklist.md](../best-practices/release-checklist.md): which items are worth checking, by target
- [choosing-component.md](choosing-component.md#testability): testability by mechanism
- [pdd-template.md](../templates/project/pdd-template.md): where acceptance criteria come from
