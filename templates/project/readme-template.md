---
title: <Project Name>
description: "Project README template: copy and fill in every placeholder"
type: template
---

<One paragraph: what this project does and who it is for.>

| | |
| --- | --- |
| **Environments** | <dev / test / uat / prod chain, e.g. `{org}-dev` → `{org}-prod`> |
| **Owner** | <name or team, and the service account for test and prod> |
| **Criticality** | <critical / non-critical> |
| **Data classification** | <public / internal / confidential / personal or regulated> |
| **Publisher prefix** | <prefix, e.g. `contoso_`> |

## Contents

| Folder | Purpose |
| --- | --- |
| `docs/` | PDD and SDD, once the solution goes to test or beyond |
| `solutions/` | Exported solution files |
| `src/` | Plugin, web resource, or Code App source |
| `pipelines/` | CI/CD definitions |

## Environments

| Environment | URL | Purpose |
| --- | --- | --- |
| Dev | <url> | Development |
| Test | <url> | Integration and regression |
| Prod | <url> | Live; changes via release only |

## Getting started

1. Prerequisites: <licences, group memberships, connections>
2. Setup: <steps a new developer takes on day one>
3. Build and test: <commands, or where the checklist lives>

## Operations

- **What breaks most often:** <the known failure modes>
- **Who to call:** <owner, then escalation>
- **How to roll back:** <previous managed solution version, or the pipeline run>

## Links

- Board: <url>
- PDD: <path>
- SDD: <path>
