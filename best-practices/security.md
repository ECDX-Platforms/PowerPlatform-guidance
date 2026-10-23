---
title: Security and Access Management
description: Security layers, identity ownership, Dataverse roles, Entra group teams, isolation, audit, managed security, and DLP policies
type: practice
tags: [security, identities, service-accounts, spn, security-roles, groups, tenant-isolation, auditing, dlp, csp, managed-security]
last_reviewed: 2026-10-23
---

## Layers

| Layer | Question | Mechanism |
| --- | --- | --- |
| Tenant | Who may authenticate at all? | Entra ID, conditional access, tenant isolation |
| Environment | Who may enter this environment? | Environment security groups, Managed Security |
| Resource | Who may use this app, flow, or agent? | Sharing, ownership |
| Data | What rows and columns may they touch? | Dataverse role-based security, field-level security |
| Output | What may leave the tenant? | [DLP](#dlp-policies), tenant isolation |

Access to an app does not grant access to its data. Design the data layer as if the app layer
were wide open, because it might be.

Provision Dataverse in every environment that hosts shared solutions: role-based security,
field-level security, and auditing all live there. Personal environments are the exception.

## Data classification

Classify the **data**, not the app. The class decides who may build with it and what controls apply.

| Class | Means | Examples |
| --- | --- | --- |
| **Public** | Already published or publishable | Marketing material, open documentation |
| **Internal** | Visible to all staff, not outside | Process documentation, internal comms |
| **Confidential** | Commercially or contractually restricted | Customer records, contracts, financials |
| **Personal / regulated** | Legal duties apply | Personal data, health, payment data |

Rules that follow from the class:

- **Confidential or above** needs a documented owner outside IT, auditing on, and a retention
  position that someone will defend.
- **Personal / regulated** adds field-level security on the sensitive columns, and a review of what
  any AI feature or external connector does with the data before it is enabled.
- Public and internal data in a developer environment needs no ceremony. Say so, rather than
  applying the full checklist to everything and training people to ignore it.

## Identities

| | **Personal account** | **Service account (SVC)** | **Service principal (SPN)** | **Managed identity** |
| --- | --- | --- | --- | --- |
| Component support | All | All | Partial | Not supported for apps and flows |
| Licensing | User licence | User licence | Power Automate Process, plus likely user licences | n/a |
| Lifecycle risk | Breaks when the person leaves or is away | Password/MFA reset | Secret rotation | n/a |
| Supportability | Ops can't reach the components | Joint work with maker may be needed | No access constraints | n/a |
| ALM | None | None | Requires automated pipelines | n/a |

Rules:

- **Developer environments**: the maker owns everything. Accept the availability risk.
- **Shared development**: the maker or a service account owns it. A shared personal account tends to
  become nobody's.
- **Test, UAT and production**: a service account or SPN owns every component, including apps, flows,
  connection references, agents.
- One service account per environment chain. Reusing one across production environments removes the
  blast-radius argument for having service accounts at all.
- Service accounts: system administrator in their chain, MFA on, password in the vault, and licensed
  for whatever capability the solution actually uses ([naming](naming.md#service-accounts)). Do not
  assume a fixed pair of SKUs: which licences qualify depends on the product and changes.
  [Microsoft's licensing pages](https://learn.microsoft.com/power-platform/admin/managed-environment-licensing)
  are the authority, including for entitlement a first-party product can satisfy.
- SPN limits to plan around: not every connector supports SPN connections (hybrid SPN + SVC is
  normal), canvas app ownership by SPN works only through pipelines, and SPN-owned flows may need
  Power Automate Process licensing.
- Production components owned by a personal account break when that person leaves, and operations
  cannot get in to help. A service account in that role is the separation of duty.

## Baseline security roles

| Role | Who gets it |
| --- | --- |
| **Basic User** | Everyone, in every environment |
| **Environment Maker** | Anyone who builds solutions in the environment |
| **System Customizer** | Anyone who creates Dataverse tables |
| **System Administrator** | Service accounts in test and prod; developers in dev only |
| **Transcript Viewer** | Service accounts only, for agent conversation transcripts |

Build a custom role off App Opener when a model-driven app needs a narrower baseline than Basic User.

System administrator in test and prod belongs to a service account. Giving a personal account
that role undoes the separation of duty the pipeline is there to give you.

## Entra ID group teams

**Access and every role assignment go through groups.** Direct user assignment is acceptable
only in personal developer environments and Default.

- Environment security groups are cloud-only Entra security groups; not supported on Default or
  Developer environments.
- Users are not added to environment security groups directly. Nested groups provide the access,
  and those nested groups become **Dataverse group teams** carrying the security roles.
- One group can grant environment access, a security role, and app sharing. That is the point.
- Naming: [naming.md](naming.md#entra-id-groups).

## Tenant administration

- **Global administrator**: a handful of named people, admin workloads only.
- **Power Platform administrator**: the working admin role, elevated through PIM.

Admin work happens from a hardened workstation with PIM elevation, on a separate admin account.
Admin accounts are for administering. Using one to build blurs the audit trail.

## Tenant isolation

**Tenant isolation ON**, inbound and outbound. Off by default, and the single most important
tenant setting: without it, anyone with their own dev tenant can bypass your DLP by connecting
to your Microsoft APIs from outside. Whitelist partner tenants explicitly.

PPAC → Security → Identity and access.

## Managed Security

Available with Managed Environments. These are worth deciding per environment at setup rather than
retrofitting:

IP firewall, IP cookie binding, Customer Managed Key, Lockbox, virtual networks, and SAS token IP
restriction. Cookie binding is the one to switch on wherever Dataverse holds data; the rest depend on
what the environment holds and who can reach it. Weigh each against the setup and maintenance cost,
especially virtual networks in hybrid scenarios where only part of a solution can use them.

Session expiry and inactivity timeout are worth setting in every environment.

## Content Security Policy

CSP is on for all environments except personal developer ones. It is the one control that limits
what a front-end is allowed to fetch, so it belongs in the same conversation as DLP rather than in
the app's own design notes.

- `frame-ancestors` at least the [common configuration](https://learn.microsoft.com/power-platform/admin/content-security-policy#common-configurations).
- `connect-src` is the DLP for fetch calls: whitelist deliberately, never `*`.
- `script-src` allows remote code execution: avoid it.

## Dataverse auditing

- On in every test and production environment, at table creation rather than retrofitted.
- Log access on, so reads are recorded alongside writes.
- Retention: five years for regulated and financial data, aligned with the rule that applies to
  the data; shorter where nothing requires otherwise.
- That volume eats capacity. Export to
  [Synapse Link](https://learn.microsoft.com/power-platform/admin/audit-data-azure-synapse-link)
  rather than growing the audit table forever.

## Secrets and credentials

- Never store secrets in solutions, flows, environment variables, or app settings. Environment
  variables are readable configuration, not a vault.
- Use Key Vault and connection references; the platform resolves credentials at runtime.
- No credentials, tokens, or connection strings in docs, templates, or generated code.
- Rotate on owner change and on schedule. Extending a secret's life because rotating is inconvenient
  is how a temporary exception becomes permanent.
- Remove access when it stops being used. Unused is the same as unnecessary.

## DLP policies

[DLP policies](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention) decide
which connectors may be used, and alongside what. Three shared policies, not bespoke ones:

| Policy | Scope | Posture |
| --- | --- | --- |
| **Baseline** | All environments | Blocks connectors nobody legitimately needs: raw mail send, unapproved third-party and custom endpoints |
| **Standard** | All managed environments, and every new environment by default | Approved business connectors only. Dataverse sits alone |
| **Innovation** | One environment | Open by design: any URL. Pair with sharing limits and night shutdown |

Rules:

- Tenant policy is the floor; environment policy can only tighten it. Environment policies cannot override
  tenant-level ones.
- Policies are additive and the most restrictive wins. Each extra concurrent policy per
  environment multiplies the runtime subgroups. Keep the count low.
- **Default new and custom connectors to Blocked**, approve on review.
- Custom connector URLs are evaluated top-down. Allow rules go above any block-all.
- **Unblockable Microsoft connectors** can only be blocked in Managed Environments. Know which
  ones before promising a maker they're blocked.
- **Desktop flow actions** are in DLP scope too; no Managed Environment needed.
- Exemptions are requested with a stated argument, reviewed, and time-boxed. A policy nobody can
  get an exception to gets worked around instead.
- DLP is a guardrail, not an authorization system. API access control belongs at the API.

Microsoft now says "data policies". For endpoint-level control beyond connector grouping, see
[advanced connector policies](https://learn.microsoft.com/power-platform/admin/advanced-connector-policies).

### Connector approval

1. **Solution need**: the owner runs a security review against the requirements, then the
   connector is approved or rejected tenant-wide. All or none.
2. **Standing review**: a recurring review with security, platform, and API owners keeps the
   connector list honest.

## References

- [Microsoft: security overview](https://learn.microsoft.com/power-platform/admin/security)
- [Microsoft: environment security groups](https://learn.microsoft.com/power-platform/admin/control-user-access)
- [Microsoft: cross-tenant restrictions](https://learn.microsoft.com/power-platform/admin/cross-tenant-restrictions)
- [Microsoft: DLP policies](https://learn.microsoft.com/power-platform/admin/wp-data-loss-prevention) · [connector classification](https://learn.microsoft.com/power-platform/admin/dlp-connector-classification)
- [Microsoft: service principal support](https://learn.microsoft.com/power-automate/service-principal-support)
- [Microsoft: advanced connector policies](https://learn.microsoft.com/power-platform/admin/advanced-connector-policies) · [desktop flows](https://learn.microsoft.com/power-automate/desktop-flows/manage)
- [Microsoft: Managed Security](https://learn.microsoft.com/power-platform/admin/security/managed-security)
- [Microsoft: security overview](https://learn.microsoft.com/power-platform/admin/security/overview)
