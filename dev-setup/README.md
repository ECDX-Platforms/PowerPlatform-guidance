---
title: Developer Setup
description: "Getting a workstation ready for Power Platform work: editor, CLIs, MCP servers and agent skills, in the order you need them"
type: index
---

Get a machine ready in this order. Each step depends on the one before it, and none of it is
optional if you intend to build anything beyond a personal flow.

| # | Doc | What it gets you |
| --- | --- | --- |
| 1 | [vscode.md](vscode.md) | Extensions that carry the tooling, and MCP servers configured |
| 2 | [cli.md](cli.md) | `pac` and `pa`, which are different tools for different jobs |
| 3 | [skills.md](skills.md) | The Microsoft agent skills that generate apps, flows, plugins and pages |

Then [packages/](../packages/) if you want all of it installed into a project by manifest rather than
by hand.

## The short version

```bash
# 1. editor
#    install: microsoft-IsvExpTools.powerplatform-vscode, ms-CopilotStudio.vscode-copilotstudio

# 2. CLIs
pac --version                        # ships with the Power Platform Tools extension
npm install --global @microsoft/power-apps-cli   # `pa`, for code apps only

# 3. agent skills
curl -fsSL https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js | node
curl -fsSL https://raw.githubusercontent.com/microsoft/power-platform-skills/main/scripts/install.js \
  | node - --include-dataverse       # add the Dataverse plugin
```

## What you actually need

Not everyone needs all of it. Minimum by task:

| Task | Needs |
| --- | --- |
| Read and review solutions | `pac`, the skills for `dataverse` |
| Build a canvas or model-driven app | `pac`, `canvas-apps` or `model-apps` |
| Build a code app | `pac`, `pa`, `code-apps-preview` |
| Build a plugin or code component | `pac`, .NET SDK, `pcf` |
| Build a Copilot Studio agent | `pac`, the Copilot Studio extension or MCP |
| Work on flows | `pac`, `az login`, `power-automate` |

## House rules for tooling

- Pin versions where the estate needs reproducible tooling. Auto-update is convenient and it is a
  supply chain.
- Never enable blanket auto-approval for an agent. Pre-approve the specific tools a workflow needs.
- Review `.vscode/mcp.json` changes like any other config change: an MCP server is an executable
  capability.
- Keep secrets out of configuration. Use environment placeholders
  ([security](../best-practices/security.md#secrets-and-credentials)).
