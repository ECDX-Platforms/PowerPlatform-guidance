---
title: Agent Skills and Plugins
description: "The Microsoft Power Platform plugin marketplace: every plugin, what it needs, how to install it, and which one to reach for"
type: reference
tags: [skills, plugins, power-platform-skills, dataverse-skills, copilot, claude, scaffolding, marketplace]
last_reviewed: 2026-10-23
---

Microsoft ships agent skills for Power Platform as a **plugin marketplace**, not as documentation.
These plugins are the practical backbone of day-to-day platform development: they scaffold apps,
drive PAC and the MCP servers, and encode vendor guidance that this repo will never keep up with.

Two consequences for us:

1. **Do not hand-roll scaffolding.** If a plugin generates it, let the plugin generate it. Our
   standards then describe what to *decide*, not what to type.
2. **Read the plugin, not the blog post.** Plugin capabilities change faster than any guidance we
   could write down. The links below are the source of truth.

## Where the plugins live

| Source | Contents |
| --- | --- |
| [microsoft/power-platform-skills](https://github.com/microsoft/power-platform-skills) | Marketplace for every plugin below except Dataverse |
| [microsoft/Dataverse-skills](https://github.com/microsoft/Dataverse-skills) | The **Dataverse** plugin, maintained separately |

Dataverse is the largest and most important of them, and it is deliberately excluded from the
bulk installer. See [Dataverse is external](#dataverse-is-external) below.

## Install

### One command (recommended)

```bash
# macOS, Linux, Windows
curl -fsSL https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js | node
```

The installer installs `pac` if missing, detects GitHub Copilot CLI and Claude Code, registers the
marketplace, installs every plugin **except `dataverse`**, and enables auto-update.

Add the Dataverse plugin to the same run:

```bash
curl -fsSL https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js \
  | node - --include-dataverse
```

### Per plugin

Inside a Copilot CLI or Claude Code session:

```
/plugin marketplace add microsoft/power-platform-skills
/plugin install model-apps@power-platform-skills
```

Plugin names are the marketplace identifiers. The `code-apps-preview` and `mobile-app` entries are
the install names for the `plugins/code-apps` and `plugins/mobile-apps` folders: use the install
name, not the folder name.

## The plugins

| Plugin | Install name | Use it for | Stack and prerequisites |
| --- | --- | --- | --- |
| **Dataverse** | `dataverse` | Records, tables, security, solutions | Dataverse MCP, CLI, Python SDK, PAC CLI |
| **Model Apps** | `model-apps` | Whole model-driven apps from intent, plus generative pages | React + Fluent via `cds-maker-sdk` |
| **Canvas Apps** | `canvas-apps` | Author canvas apps as `.pa.yaml` through the Canvas Authoring MCP | **.NET 10 SDK** |
| **Code Apps** | `code-apps-preview` | React + Vite code apps wired to connectors | React + Vite, Node.js, PAC CLI |
| **Power Automate** | `power-automate` | Build, edit, run and debug cloud flows through the FlowAgent MCP | Node.js 18+, `az login` |
| **Power Pages** | `power-pages` | Code Sites: React, Angular, Vue, Astro | Node.js, PAC CLI |
| **PCF** | `pcf` | Code components. *Preview* | Node.js 20+, PAC CLI, .NET SDK |
| **MCP Apps** | `mcp-apps` | Codeful MCP tools plus interactive single-file widgets | Node.js |
| **Mobile Apps** | `mobile-app` | Expo + React Native code apps with native device capability | Expo; deployed via Power Apps Wrap |
| **Mobile Extension** | `power-apps-mobile-extension` | Native controls for wrapped apps | Kotlin, Objective-C, PCF |
| **Process Intelligence** | `process-intelligence` | Process Mining analysis | Node.js 22/24 LTS, Azure CLI. Not in GCC, GCC High, DoD |

## Dataverse is external

Dataverse lives in [microsoft/Dataverse-skills](https://github.com/microsoft/Dataverse-skills). The
marketplace installs it straight from that repository's default branch, which means **an unpinned
upstream branch decides what lands in your environment**. Decide deliberately whether that is
acceptable; for a locked-down tenant, install it yourself at a pinned ref.

Install it standalone:

```bash
npx skills add microsoft/Dataverse-skills -s "*"     # add -g for every project on the machine
```

Its nine skills, of which eight are relevant to this repo (`erp-xpp` covers Finance and Operations, documented separately):

| Skill | Does |
| --- | --- |
| `dv-connect` | One-time setup: installs Dataverse CLI, Python SDK, PAC CLI, authenticates, registers the Dataverse MCP server |
| `dv-query` | Read, filter, paginate, aggregate records; multi-page sets, pandas frames |
| `dv-data` | Single-record CRUD, CSV and multi-table import, upsert by alternate key, sample data |
| `dv-metadata` | Author the data model: tables, columns, relationships, forms, views |
| `dv-solution` | Solution lifecycle: create, export, import, promote, validate |
| `dv-security` | Security roles, user access, application users, business units |
| `dv-admin` | Bulk delete, retention, org settings, recycle bin, audit, PPAC toggles |
| `dv-overview` | Cross-cutting rules and tool routing, loaded before the others |

After install, ask the agent **"Connect to Dataverse"**. That hands off to `dv-connect`, which
walks authentication and MCP registration. You end up with a `dataverse-<orgname>` MCP server and
`pac auth list` showing the active environment.

If you install `dataverse` through both this marketplace and `dataverse-skills`, remove one: the
skills otherwise load twice.

## Governance concerns to settle before rolling out

These are vendor defaults rather than our decisions, so decide them consciously.

**Telemetry** is on for Power Pages, Mobile Apps, Model Apps and Power Automate. It can include the
Dataverse organisation ID, the Entra tenant ID, and sometimes the signed-in user's object ID. It does
not include prompts, file paths or record data. Opt out per plugin with `/<plugin>:telemetry off`, or
centrally with `POWER_PLATFORM_SKILLS_TELEMETRY_<PLUGIN>_OPTOUT`.

**Auto-update** is enabled by the installer. Pin versions if the estate needs reproducible tooling.

**Auto-approval** is offered in the installer docs as `--allow-all-tools` or
`--dangerously-skip-permissions`. Neither belongs in a tenant with production access. Pre-approve the
named tools a workflow needs instead: `--allow-tool 'shell(pac *)'`.

**Upstream drift:** `dataverse` tracks a default branch, so a release you did not choose can arrive.
Pin a ref, or accept the drift knowingly.

**What the agent can do** is bounded by the signed-in user's Dataverse roles. MCP access additionally
needs developer auth, tenant admin consent, and per-environment allowlisting. Confirm those before
promising that an agent will work.

Telemetry opt-out is stored in `~/.power-platform-skills/config.json`. The environment variable
wins over the saved setting, which makes it the right lever for CI.

## Which plugin for which task

Start with `dataverse`, whatever else you install: it owns the data model and the solution, which is
what every other plugin builds on. Then add the one that matches the artifact you are making.

## How this fits the rest of the repo

The plugins decide *how* things get built; our [standards](../best-practices/) decide *what* is
acceptable. A plugin will happily create a canvas app that ignores delegation, or a solution with
the default publisher. Neither is a reason to skip review.

- [coding.md](../best-practices/coding.md): the rules the generated code still has to meet
- [alm.md](../best-practices/alm.md#where-the-truth-lives): why generated output lands in the repo
- [release-checklist.md](../best-practices/release-checklist.md): what to check before it ships

Keep enabling tools honest by reviewing their output, not their intent.

## Related

- [vscode.md](vscode.md) and [cli.md](cli.md): editor, extensions and MCP, then the CLIs
- [ai-agents.md](../best-practices/ai-agents.md): Copilot Studio agent governance
- [coverage.md](../docs/coverage.md): what this repo covers

## Sources

- [microsoft/power-platform-skills](https://github.com/microsoft/power-platform-skills) · [microsoft/Dataverse-skills](https://github.com/microsoft/Dataverse-skills)
- [PAC CLI reference](https://learn.microsoft.com/power-platform/developer/cli/reference)
