---
title: Templates
description: "Boilerplate for new work: the project scaffold and the release pipeline"
type: index
---

Copy, rename, adapt. Don't edit in place.

These are the things that encode **our** decisions: how a repo is laid out, and how a solution
reaches production. We deliberately do not ship code scaffolding here. The Microsoft
[agent skills](../dev-setup/skills.md) generate plugin, canvas, code app, PCF and page skeletons, and a
copy in this repo would be stale within a release cycle.

| Folder | Use for |
| --- | --- |
| [project/](project/) | Project repo layout, plus README, PDD and SDD templates |
| [pipelines/](pipelines/) | Azure DevOps pipeline for solution deployment |

## Rules

- Templates are the agreed starting point. Improvements belong here, not in the copied project.
- Every template folder explains when and how to use it in its README.
- A template that no longer matches [best-practices/](../best-practices/) is a bug. Fix it or the copies will
  inherit the drift.
