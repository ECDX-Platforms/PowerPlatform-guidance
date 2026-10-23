---
title: Pipeline Template
description: Azure DevOps pipeline for Power Platform solution deployment using Power Platform Build Tools and SPN service connections
type: template
---

Azure DevOps pipeline for solution deployment, using
[Power Platform Build Tools](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.PowerPlatform-BuildTools)
with one Power Platform SPN service connection per environment: `pp-dev`, `pp-test`, `pp-prod`.

| File | Use |
| --- | --- |
| [solution-release.yml](solution-release.yml) | Deploy a managed solution to test or prod, behind an environment approval |

## Setup per project

1. Copy this folder into the project repo.
2. Set `SolutionName` in the variables block, e.g. `contoso_CustomerPortal`.
3. Create all three SPN service connections (`pp-dev`, `pp-test`, `pp-prod`) and grant each access to
   its environment. `pp-dev` needs export rights, so it is not optional: the first task in the
   pipeline fails without it.
4. Add an approval gate on each Azure DevOps environment (`test`, `prod`).
5. Grant the SPN the security roles the solution needs: not system administrator by reflex.

## What this pipeline actually deploys

It exports the current state of the dev environment on every run, so **the dev environment is the
build source and the repo is the record**. That is the common Power Platform pattern, and it has a
consequence worth stating plainly: anything present in dev but not committed will still ship. Keep
dev clean, and treat a committed export that differs from dev as a bug to resolve before release.

If the repo must be authoritative instead, build the managed artifact from the committed solution
rather than exporting dev. That needs a different pipeline shape and is not what this template does.

Three more things this template does not do, worth knowing before you rely on it:

- **No immutable artifact.** Each run deploys whatever dev contains, so two runs a week apart can ship
  different things without a commit in between.
- **No product-version check.** If the solution sits on a Microsoft first-party app, nothing verifies
  that test and production are on the same version.
- **No configuration-data movement.** Features that keep settings outside the solution, such as routing
  configuration, need their own documented sequence and are not covered here.

## Rules

- Pipelines are the only path to test and prod. The SPN deploys, not a person
  ([alm.md](../../best-practices/alm.md#getting-to-production)).
- Managed imports only, and no manual imports. Managed *extension* layers, where your own solution
  customises a Microsoft one, are expected; unmanaged layers created by editing production are the
  thing to avoid ([alm.md](../../best-practices/alm.md#solution-layers)).
- Copy per project; don't fork between projects. A project that needs a different pipeline has
  found a template bug.

## When not to hand-roll YAML

If you're adding conditional stages or retry logic to this file, evaluate
[Power Platform pipelines](https://learn.microsoft.com/power-platform/alm/pipelines) and the
[ALM Accelerator](https://learn.microsoft.com/power-platform/guidance/alm-accelerator/overview)
first. Someone has already solved the problem, and their version gets maintained.
