---
name: review-agent-readiness
description: Use when an agent is about to be shared, published, or released, or when auditing agents already in use. Checks authentication, channels, sharing, knowledge sources, transcripts, and testing against the agent's target environment and data class. Activate for "is this agent ready", "can I share this agent", "review my agent", or "audit our agents".
---

# Review agent readiness

An agent that is shared is a production system, whatever environment it sits in. Review accordingly.

## 1. Establish the target environment and data class

| Where it runs | Expect |
| --- | --- |
| Developer environment | One maker, co-development only, never shared for chat, no confidential or personal data |
| Shared development | One unit, internal data, shared for chat via an Entra group after review |
| Test, UAT, production | May be critical, any data, released through the pipeline |

If the agent is shared for chat but lives in a developer environment, that is the finding. Everything
else is detail.

## 2. Check the settings that cannot be wrong

| Check | Fail condition |
| --- | --- |
| Authentication | Does not match the audience. Internal users need Entra sign-in; anonymous with no auth is fine if everything behind it is public |
| Channels | A channel DLP does not allow; any non-Teams channel on a Personal agent |
| Sharing | Individual users instead of an Entra group; a dev agent shared for chat |
| Description | Missing, or missing purpose / audience / criticality / data classification |
| Owner | No named owner, or a personal account owning a Team-or-above agent in test or prod |
| Version control | Agent exists only in the maker portal with no files in the repo |
| Transcript viewer role | Assigned to anyone other than a service account, in a shared or production environment |

## 3. Check the data path

- For each knowledge source: what data class does it hold, and is that allowed in this environment?
- SharePoint and OneDrive sources: is permission trimming verified, or assumed? "Assumed" is
  unverified, and it is the most common way an agent leaks documents.
- Uploaded documents: classified like any other data in Dataverse.
- Connector tools: does each one fetch data the agent's audience may already read?

## 4. Check testing

Ask for the prompt set and its last result. A plausible agent with no scripted test is unverified.
Do not accept "we tried it and it seemed fine".

## 5. Check release mechanics

- Is the definition in files and committed?
- Does the release path match the target: manual in development, pipeline from test onward?
- Is anything about this agent's behaviour dependent on a DLP policy or connector that has changed
  recently? Blocking a Power Platform connector also removes the tools of any MCP server that
  depends on it, with no change to the agent itself.

## Report

```
Finding
Personal agent shared for chat
  FAIL: "Expense Helper" lives in a developer environment but is shared for chat with 23 users.
         Effect: an unowned production agent with no version control and no test set.
         Fix: move it into the unit chain, put the definition in the repo, add a smoke prompt
         set, then re-share via an Entra group.
```

Lead with the finding that changes the release decision. Then list the rest. If everything passes,
one line, and name what you could not verify.

## What not to do

- Do not test an agent by chatting with it and calling that a test.
- Do not accept a screenshot as evidence of a setting; read the setting.
- Do not "helpfully" change authentication or sharing to fix a finding. Report it.
