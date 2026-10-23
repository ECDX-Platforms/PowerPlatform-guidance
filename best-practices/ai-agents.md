---
title: AI Agents and Copilot Studio
description: "Rules for Copilot Studio agents and embedded AI features: authentication, channels, sharing, knowledge sources, transcripts, telemetry, responsible use"
type: practice
tags: [copilot-studio, ai-agents, responsible-ai, authentication, channels, knowledge-sources, transcripts, capacity]
last_reviewed: 2026-10-23
---

Covers Copilot Studio agents and AI features inside apps, flows, and the platform. As with any
solution, the environment it lands in sets the bar ([environments.md](environments.md)).

## Building and naming

- Personal agents need the free Copilot Studio user licence and maker group membership.
- Agents that are shared with anyone are built in the chain the audience requires
  ([environments.md](environments.md#special-workloads)).
- Name `{Domain} {Function}`. **Description is mandatory**: purpose, audience, criticality, data
  classification ([naming.md](naming.md#ai-agents)).

## Tooling

Agents can be built from a terminal and kept in version control, which is what makes them
reviewable. Three options, in order of preference for our work:

| Route | Use when |
| --- | --- |
| **Copilot Studio MCP** | Full agent lifecycle from VS Code or Copilot CLI. stdio, browser sign-in |
| **`pac copilot`** | Agents to version-control or build in a pipeline. Needs .NET 10+ |
| **Copilot Studio extension** | Editing agent components as files, in the editor |

All three end the same way: agent definitions exist as files, get committed, and move through the
pipeline. An agent that exists only in the maker portal has no history and no review trail.

Details and configuration: [dev-setup/vscode.md](../dev-setup/vscode.md#mcp-servers).

### Direction of MCP

Four different things get called "MCP" in this space. Get the direction right before configuring
anything:

| Direction | What it means |
| --- | --- |
| Copilot Studio **as** an MCP server | Your CLI or editor drives Copilot Studio. Local stdio package |
| An agent **consuming** an MCP server | The agent gains tools. This is what DLP restricts |
| A published agent **exposed** as a remote MCP server | The MCP and A2A channels. Preview, early-release environments only |
| Dataverse MCP | A separate remote server for data, not agents |

**DLP rule that bites:** blocking a Power Platform connector also blocks the tools of any MCP server
that depends on it. An agent can lose a tool because of a DLP change, with no change to the agent.

## Authentication

Three options exist in the agent's security settings. Which one is right follows from the audience and
the channel, not from a preference.

| Option | What it does | When it fits |
| --- | --- | --- |
| **No authentication** | No sign-in; public content only | Anonymous audiences |
| **Authenticate with Microsoft** | Entra ID across Microsoft channels | Employees there. **Not available for Customer Service** |
| **Authenticate manually** | You configure Entra ID or generic OAuth2 yourself | Any channel other than Teams, or a third-party identity provider |

The middle option is the convenient one and the one with the largest exception: if the agent sits in
front of Customer Service, or needs a non-Microsoft channel, you are configuring authentication by hand.
Teams with manual authentication also needs separate SSO and app manifest work.

An agent integrated with Customer Service carries more constraints than the authentication setting, and
they are worth knowing before you pick a channel. It has to live in the **same environment** as the
Customer Service installation, which rules out putting it in a separate chain of its own. The website
embed code comes from the Customer Service chat widget rather than from Copilot Studio. An agent created
outside Customer Service lacks the Session Timeout topics the product expects, so conversations do not
close cleanly and supervisor metrics mislead. See
[handoff configuration](https://learn.microsoft.com/microsoft-copilot-studio/configuration-hand-off-omnichannel).

### No authentication is a legitimate design, not a mistake

Microsoft documents it as a supported option, and an agent with no authentication **can only access
public information and resources**. That constraint is the actual rule, not the setting itself.

Use it when the audience is genuinely anonymous and the agent touches nothing non-public. For internal
agents it costs you three things at once: you cannot control which of your own users chats with it,
there is no per-user identity for scoping what the agent can see, and the audit trail cannot name who
asked.

Two controls sit around it:

- **DLP can force authentication.** If a data policy in the admin centre requires authentication, the
  no-authentication option is not available at all. Check the policy before promising a customer-facing
  agent to anyone.
- **The content is the control.** For a public agent, what it can read is the whole safety story:
  public knowledge sources only, no Dataverse customer records, no connector that reaches internal
  systems. If it can reach something private, it needs authentication regardless of audience.

Authentication does not govern collaboration sharing; that is separate.

## Channels

DLP decides the channels, not convenience ([security.md](security.md#dlp-policies)). The defaults are
set for internal agents, which is most of them.

- Teams and Microsoft 365: allowed by default.
- Direct Line, Facebook, Omnichannel, the SharePoint channel, and other non-Entra chat surfaces:
  blocked unless a reviewed use case justifies them.
- Personal agents run from Teams or Copilot Studio only. Never published as a shareable agent.

A customer-facing agent is exactly that reviewed use case. It needs an anonymous channel enabled, and
there is no way to build one without it, so enabling the channel is part of the design decision rather
than an exception requested afterwards. Record it in the SDD next to the authentication choice, and
pair it with the content constraint from [Authentication](#authentication): public knowledge sources
only.

## Sharing

| Where it runs | Sharing |
| --- | --- |
| Developer environment | Co-development only. **Never** shared for chat. |
| Shared development | For chat, with an Entra ID group, after review |
| Test, UAT, production | For chat, with an Entra ID group, through the normal release |

Groups, never individual users. Sharing for chat is a release decision, not a maker decision.

## Knowledge sources

Let the agent read only what the audience may already read. DLP enforces part of that; review
enforces the rest.

| Source | Notes |
| --- | --- |
| SharePoint and OneDrive | Restricted by DLP endpoint rules. Permission trimming is configuration-dependent: verify before trusting it |
| Public websites | Public content only, never anything behind a login |
| Uploaded documents | Stored in Dataverse. Classify them like any other data |

## Generative AI

- Generative orchestration is fine for agent behaviour; it is not a substitute for a deterministic
  flow where the outcome must be exact.
- Treat output as a draft. Humans review generated apps, formulas, documents, and agent answers
  before someone acts on them.
- Never send personal or regulated data through AI features without knowing what the feature does
  with it. Copilot features may process data across geographies: check tenant geo settings first.
- Disable AI features per environment where compliance requires it (PPAC → product features).
- **Document which parts of a solution were AI-generated** so reviewers know where to look.

## Testing

Testing support in the authoring experience is thin.

- Production agents: evaluate the
  [Copilot Studio Kit testing capabilities](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit/blob/main/TESTING_CAPABILITIES.md).
- Every agent: a scripted set of prompts with expected behaviours, run against the release. An agent
  with no test prompts is an agent nobody has checked.

## Transcripts and telemetry

Retention is per environment, 30 days by default. Transcripts contain whatever users typed, including
personal data, so treat the setting as a privacy decision rather than a reporting convenience. For
longer retention, export to Azure Data Lake Storage instead of extending in-place retention. Reading
them needs the Transcript Viewer role, which is normally a service account.

Built-in analytics only work for people who can open the maker experience, which in test and production
means the service account. Application Insights fills that gap, and is a per-environment DLP decision.
The CoE toolkit adds tenant-wide inventory; the
[Copilot Studio Kit](https://github.com/microsoft/Power-CAT-Copilot-Studio-Kit) adds agent-level
analytics. If you publish Kit reports to business users, apply row-level security first: the stock
reports do not, so every viewer sees every agent's data.

Estimate message volume before release and allocate it across the chain. Running out shows up as a
broken agent at the worst moment.

## Dataverse for Teams

Not an option. It has no generative AI capability, and the environment type is being retired entirely
([environments.md](environments.md#dataverse-for-teams-is-being-retired)).

## References

- [Microsoft: agent authentication](https://learn.microsoft.com/microsoft-copilot-studio/configuration-end-user-authentication) · [agent DLP](https://learn.microsoft.com/microsoft-copilot-studio/admin-data-loss-prevention)
- [Microsoft: knowledge sources](https://learn.microsoft.com/microsoft-copilot-studio/knowledge-copilot-studio) · [transcript retention](https://learn.microsoft.com/microsoft-copilot-studio/analytics-transcripts-powerapps)
- [Microsoft: capturing telemetry](https://learn.microsoft.com/microsoft-copilot-studio/advanced-bot-framework-composer-capture-telemetry)
- [Responsible AI FAQs for Power Apps](https://learn.microsoft.com/power-apps/maker/common/responsible-ai-overview)
- [Copilot Studio MCP](https://learn.microsoft.com/microsoft-copilot-studio/agents-experience/copilot-studio-mcp)
- [MCP as a tool inside agents](https://learn.microsoft.com/microsoft-copilot-studio/agent-extend-action-mcp)
