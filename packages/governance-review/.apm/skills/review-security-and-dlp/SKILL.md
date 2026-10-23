---
name: review-security-and-dlp
description: Use when reviewing access, identity, secrets, or connector policy on a Power Platform environment, or when answering "who can reach this", "is this data exposed", "do we need a DLP exception". Produces a security finding set for one environment or one solution, each tied to the item it came from. Activate for security review, DLP review, access audit, least-privilege check, or secret-handling question.
---

# Review security and DLP

Scope to **one environment** (or one environment chain) per pass. Security findings that span
environments are usually just one environment's problem repeated.

## Establish the environment's posture

Read the actual settings. Do not infer them from a document.

| Check | Expected |
| --- | --- |
| Environment security group attached | Yes, for shared environments |
| Users added directly to the environment security group | No: nested groups only |
| Security roles assigned to Entra group teams | Yes |
| System Administrator holders | Service account in test/prod; developers in dev only |
| Tenant isolation | On, inbound and outbound |
| DLP policy in scope, connectors in use approved | Yes |
| Auditing | On where data warrants, with agreed retention |
| Managed Security decisions | Recorded, not defaulted |
| Secrets in environment variables or app settings | None |

## The five layers

Work down them. A gap higher up makes everything below it irrelevant.

| Layer | Question | What to inspect |
| --- | --- | --- |
| Tenant | Who may authenticate at all? | Tenant isolation, conditional access, tenant admin roles |
| Environment | Who may enter? | Environment security group, Managed Security features |
| Resource | Who may use this app, flow, or agent? | Sharing, ownership |
| Data | What rows and columns? | Security roles, field-level security, business units |
| Output | What may leave? | DLP policies, custom connector endpoints, CSP |

Access to an app does not grant access to its data. Check the data layer as if the app layer were
wide open, because it might be.

## DLP specifics

- Policies are **additive** and the most restrictive wins. Count the concurrent policies per
  environment; each one multiplies runtime subgroups.
- Tenant-level policy is the floor. Environment policy can only tighten.
- Custom connector URLs are evaluated top-down. Allow rules must sit above any block-all.
- Unblockable Microsoft connectors can only be blocked in Managed Environments. Do not promise a
  maker that one is blocked before checking.
- Desktop flow actions are in scope too.
- Blocking a Power Platform connector also blocks the tools of any MCP server that depends on it.
  An agent can lose a capability because of a DLP change, with no change to the agent.

## Identity and ownership

| Owner | Acceptable for test and prod? |
| --- | --- |
| Personal account | **No.** Breaks when the person leaves, ops cannot reach it |
| Service account (SVC) | Yes. One per environment chain, licensed, MFA, vaulted password |
| Service principal (SPN) | Yes, with caveats: not all connectors support SPN connections, and SPN-owned flows may need Power Automate Process licensing |
| Managed identity | Not supported for apps and flows |

Flag "one service account reused across two production chains": it is common and it destroys the
blast-radius argument for having service accounts at all.

## Secrets

Look in environments variables, app and flow settings, custom connector definitions, and any
committed configuration. A secret in an environment variable is readable by every maker in that
environment.

Correct pattern: Key Vault plus connection references, resolved at runtime.

## Report

Group findings by layer, not by check number: the reader needs to know where the hole is.

```
Tenant
  FAIL: tenant isolation off. Anyone with their own dev tenant can bypass DLP by calling
                 our APIs from outside. Fix: PPAC → Security → Identity and access.

Environment
  PASS: environment security group attached, no direct user members.
  FAIL: 4 users hold the "Customer Portal User" role directly instead of via a group team.
                 Effect: access survives team changes and is not reviewable.

Data
  UNVERIFIED: no field-level security profiles visible; no access to the environment.
```

Close with: the environment reviewed, the bar it is being held to, the count by severity, and
anything that must be fixed before the next release rather than eventually.
