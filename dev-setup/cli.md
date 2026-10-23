---
title: CLIs
description: "pac and pa: two different Microsoft CLIs, what each is for, and how to install them"
type: guide
tags: [pac, pa, power-platform-cli, power-apps-cli, install]
last_reviewed: 2026-10-23
---

The single most common source of confusion on this platform. Two CLIs, similar names, no overlap.

| | `pac` | `pa` |
| --- | --- | --- |
| Full name | Power Platform CLI | Power Apps CLI |
| Purpose | Environments, solutions, PCF, Power Pages, plugins, pipelines, auth profiles, data | **Code apps only** |
| Install | VS Code extension (recommended), .NET tool, or Windows MSI | `npm install --global @microsoft/power-apps-cli` |
| Installed by | The VS Code extension, the .NET tool, or the Windows MSI | npm |
| Typical commands | `pac auth create`, `pac solution export`, `pac env list`, `pac plugin init` | `pa app init`, `pa app run`, `pa app push` |

`pac` is the platform-wide developer CLI. `pa` exists because code apps need a JavaScript-native
toolchain: it generates typed connector services and publishes the compiled bundle.

**Rule: `pac` for the platform, `pa` for code apps.** If you reach for `pa` for anything else, you
want `pac`. `pac code` exists as a preview command group, but Microsoft points at the npm-based `pa`
for current code app work.

## Installing pac

Install the [Power Platform Tools](https://marketplace.visualstudio.com/items?itemName=microsoft-IsvExpTools.powerplatform-vscode)
VS Code extension. It carries `pac` and updates automatically, which is what you want in nearly every
case.

Caveat: installed *only* this way, `pac` works in a VS Code terminal and nowhere else. For a
system-wide `pac`, use the .NET tool or the Windows MSI. On macOS and Linux the extension is the
supported path.

`pac data`, `pac package deploy` and `pac package show` are Windows-only, **and** only available if
`pac` came from the VS Code extension or the MSI. Install via the .NET tool alone and those commands
are absent on Windows too.

Verify:

```bash
pac --version     # 1.30.x or later
pac auth list     # which environments you are signed into
```

## Installing pa

```bash
npm install --global @microsoft/power-apps-cli
npm install --global @microsoft/power-apps
pa --version
pa auth login
```

`pa app init` scaffolds and wires a code app to an environment, `pa app run` serves it locally, and
`pa app push` publishes. Use `pa solution list` and `pa connector list` to find the identifiers the
other commands need.

## Other CLIs you will meet

| Tool | Use |
| --- | --- |
| `az` | Azure CLI. Required by `power-automate` and `process-intelligence` skills |
| `azd` | Azure Developer CLI, when a solution has Azure side components |
| `dataverse` | Dataverse CLI, installed by the `dv-connect` skill. **Preview** |
| `apm` | Agent Package Manager, for installing the [packages](../packages/) in this repo |

## Rules

- Update regularly. A stale CLI fails in ways that look like permissions errors, and you will spend
  an afternoon on it.
- Use one auth profile per environment so a command cannot hit the wrong one.
- Never let an agent run `pac auth` or `pa auth` unattended against production.

## Sources

- [Install Power Platform CLI](https://learn.microsoft.com/power-platform/developer/cli/introduction)
- [pac command reference](https://learn.microsoft.com/power-platform/developer/cli/reference)
- [Power Apps CLI reference](https://learn.microsoft.com/power-apps/developer/code-apps/reference/cli) · [code app quickstart](https://learn.microsoft.com/power-apps/developer/code-apps/how-to/create-an-app-from-scratch)
