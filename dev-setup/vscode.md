---
title: VS Code
description: The extensions that carry the Power Platform tooling, and how to configure MCP servers for VS Code and Copilot CLI
type: guide
tags: [vscode, extensions, mcp, copilot-studio, dataverse, configuration]
last_reviewed: 2026-10-23
---

## Extensions

| Extension | ID | Why |
| --- | --- | --- |
| **Power Platform Tools** | `microsoft-IsvExpTools.powerplatform-vscode` | Carries `pac`; solutions, environments, plugins |
| **Microsoft Copilot Studio** | `ms-CopilotStudio.vscode-copilotstudio` | Clone agents, edit components, sync back |
| C# Dev Kit | `ms-dotnettools.csdevkit` | C# plug-ins: build, debug, test discovery. PCF components are TypeScript, so they use Node tooling instead |
| Playwright | `ms-playwright.playwright` | End-to-end and regression tests |
| YAML + Markdown lint | `redhat.vscode-yaml`, `davidanson.vscode-markdownlint` | Pipeline files and this knowledge base |

`microsoft-IsvExpTools.powerplatform-vscode` is the VS Code extension. It is not the same thing as
`microsoft-IsvExpTools.PowerPlatform-BuildTools`, which is the **Azure DevOps** extension used by the
[pipeline template](../templates/pipelines/). Both IDs are easy to mix up, and installing the wrong
one wastes an afternoon.

### Copilot Studio extension

- Windows x64 and macOS only. **No Linux support.**
- Needs VS Code 1.80+, a Copilot Studio licence, and read/write access to the agents you edit.
- It clones agent definitions to files on disk and syncs them back. That makes agents
  version-controllable, which matters for [ALM](../best-practices/alm.md#where-the-truth-lives): an agent that
  exists only in the maker portal has no history.
- The CLI equivalent is `pac copilot clone` / `pull` / `push` / `pack`, which is what you want in a
  pipeline rather than a workspace.
- Uninstalling the extension does **not** delete cloned agent files. Clean them up yourself.

## MCP servers

MCP is how an agent reaches the platform. There are four separate surfaces, and conflating them
produces a configuration that looks plausible and does not work.

| Surface | Direction | What it is |
| --- | --- | --- |
| **Dataverse MCP** | Agent → Dataverse | Remote HTTP server at `https://{org}.crm.dynamics.com/api/mcp` |
| **Copilot Studio MCP** | Agent → Copilot Studio | Local npm package over **stdio**, launched with `npx` |
| **`pac copilot mcp --run`** | Agent → Copilot Studio | Local stdio server shipped with PAC. Needs **.NET 10+** |
| **MCP inside an agent** | Agent → other tools | A Copilot Studio agent consuming an MCP server as a tool |

A published agent can also be *exposed* to MCP clients through the MCP and A2A channels. That is a
preview publishing feature, not a local tool: see
[ai-agents.md](../best-practices/ai-agents.md#tooling).

### Dataverse MCP

```jsonc
// .vscode/mcp.json
{
  "servers": {
    "DataverseMcp": {
      "type": "http",
      "url": "https://your-org.crm.dynamics.com/api/mcp"
    }
  }
}
```

- Entra ID only. No API keys.
- Requires the **Power Platform administrator** role to enable, plus per-environment enablement for
  clients other than Copilot Studio, which is on by default.
- Respects Dataverse security roles and row-level security. There are no MCP-specific permissions
  beyond that.
- Exposes 15 tools, including `search_data`, `search`, `describe`, `read_query`, `create_record`,
  `update_record`, `delete_record`, and the table-level create/update/delete tools.
- Tool names changed. `describe_table`, `list_tables` and `fetch` are now `describe`; the old data
  `search` is now `search_data`, and `search` now means metadata. Any allow or deny list written
  against the older names is wrong.
- Billing applies to these tools when an AI agent outside Copilot Studio uses them, from 15 December
  2025. Copilot Studio agents are exempt, as is anything covered by a qualifying licence.
- Allow-listing applies to `/api/mcp` only. Custom APIs that happen to have "MCP" in the name are
  ordinary Dataverse APIs and are not gated by it.

### Copilot Studio MCP

```jsonc
// .vscode/mcp.json: also installable from the extension registry with @mcp copilot-studio
{
  "servers": {
    "copilot-studio-mcp": {
      "command": "npx",
      "args": ["-y", "@microsoft/copilot-studio-mcp@latest"]
    }
  }
}
```

- stdio only. There is no endpoint to add: the client launches the npm package.
- Node 22.18+ (24 LTS recommended), with `npx` on the PATH the client uses.
- Sign-in is browser-based with your work account, then you select an environment.
- **There is no admin toggle** to enable it. Access is your identity, your environment access, and
  your organisation's client policy. Do not go looking for a switch that does not exist.
- Five tools, not a CRUD surface: `discover_resources`, `get_consumption`, `manage_agents`,
  `manage_workflows`, `get_copilot_studio_skills`. Each exposes operations through `action` and
  `parameters`.
- Start any session by reading `get_copilot_studio_skills`; that guidance is more current than
  anything in this repo.
- Pin a version instead of `@latest` if you need reproducible behaviour.

### The `servers` vs `mcpServers` trap

VS Code-specific configuration uses a top-level **`servers`** object. The portable format, and GitHub
Copilot CLI, use **`mcpServers`**. Copilot CLI does not read `.vscode/mcp.json` at all.

```jsonc
// ~/.copilot/mcp-config.json  (GitHub Copilot CLI, user scope)
{
  "mcpServers": {
    "copilot-studio-mcp": {
      "type": "local",
      "command": "npx",
      "args": ["-y", "@microsoft/copilot-studio-mcp@latest"],
      "tools": ["*"]
    }
  }
}
```

Merge into the existing object. Never overwrite an unrelated server entry. `tools: ["*"]` makes tools
*available*; it does not approve their actions.

## Repo configuration

Configure per user or per repo in `.vscode/mcp.json`. Treat that file as code:

- Keep it in the repo so the team shares one configuration.
- No secrets. Use environment placeholders, never literals.
- Review changes to it like any other config change.

## Sources

- [Power Platform Tools extension](https://learn.microsoft.com/power-platform/developer/howto/install-vs-code-extension)
- [Copilot Studio extension](https://learn.microsoft.com/microsoft-copilot-studio/visual-studio-code-extension-install-configure)
- [Copilot Studio MCP](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/copilot-studio-mcp) · [VS Code and Copilot CLI setup](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/copilot-studio-mcp-vscode-copilot-cli)
- [Dataverse MCP](https://learn.microsoft.com/power-apps/maker/data-platform/data-platform-mcp)
