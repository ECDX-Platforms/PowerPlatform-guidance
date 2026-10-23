---
description: "Copilot Studio agent rules: authentication baseline, channel and sharing policy, data boundaries, transcripts, and release checks"
applyTo: "**"
---

# Building agents to ECDX practices

An agent is a solution. It has an owner, a data classification, a target environment, and a release
path. The environment it lands in sets the bar: the same way it does for anything else.

## Baseline decisions you do not get to skip

- Authentication follows the audience. Employees in Teams get "Authenticate with Microsoft";
  employees on another channel get Microsoft Entra ID. **Customers and anonymous visitors get "No
  authentication"**: a supported option, and what classic customer chatbots use by default. An
  unauthenticated agent can only reach public information, so enforce that constraint rather than
  banning the setting. Never use it for internal agents, where it costs you identity for scoping
  and audit.
- Description field is mandatory. It carries purpose, audience, criticality, and data classification.
  It is the only metadata an inventory scan or a reviewer has to work from.
- **Name:** `{Domain} {Function}`, e.g. `HR Policy Assistant`, `Invoice Triage Agent`.
- Channels are decided by DLP, not by convenience. Teams and Microsoft 365 are allowed by default.
  Direct Line, Facebook, Omnichannel, and the SharePoint channel are blocked unless a reviewed use
  case justifies them.
- Sharing is a release decision, not a maker decision. Share with an Entra ID group, never with
  individual users.

## By environment

| Where it runs | Shared for chat | Owner | Version control |
| --- | --- | --- | --- |
| Developer environment | **Never**: co-development only | The maker | Recommended |
| Shared development | After review, via an Entra group | The maker or a service account | Required |
| Test, UAT, production | Through the normal release, via an Entra group | Service account | Required |

Publishing a developer-environment agent for chat is how an unowned production agent appears.

## Data boundaries

- Let the agent read only what the audience may already read.
- Never send personal or regulated data through AI features without knowing what the feature does
  with it.
- Uploaded knowledge documents live in Dataverse: classify them like any other data.
- For SharePoint sources, permission trimming is configuration-dependent. Verify before trusting it;
  do not assume the agent respects the file-level permissions of the person asking.

## Generative AI

- Generative orchestration is fine for agent behaviour. It is **not** a substitute for a
  deterministic flow where the outcome must be exact.
- Treat output as a draft: humans review generated content before someone acts on it.
- Document which parts of the solution were AI-generated, so reviewers know where to look.

## Transcripts

Transcripts contain whatever users typed, including personal data. Retention is per environment,
30 days by default.

- Treat the setting as a privacy decision, not a reporting convenience.
- Need longer retention for audit? Export to Azure Data Lake Storage rather than extending in-place
  retention indefinitely.
- Reading transcripts needs the **Transcript Viewer** role, which goes to service accounts only.

## Before release

- Authentication, channel, and sharing settings match the target environment, and match each other.
- Description states purpose, audience, criticality, and data classification.
- Knowledge sources reviewed for data classification.
- A scripted set of prompts with expected behaviours, run against this release.
- Owner recorded, and the owner knows.
- Defined in files and committed, not living only in the maker portal.

An agent with no test prompts is an agent nobody has checked.

## Dataverse for Teams

Not a place to build agents: there is no generative AI capability, and the environment type is being
retired. Use a real environment chain.

## Related

The rule set behind this lives in the ECDX repo: `best-practices/ai-agents.md`,
`best-practices/ai-agents.md`, `best-practices/environments.md`, `best-practices/security.md`.
