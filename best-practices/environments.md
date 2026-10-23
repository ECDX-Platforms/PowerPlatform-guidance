---
title: Environments
description: Environment types and what each is for, how they chain, lifecycle, access, and the controls that keep non-production from becoming production
type: practice
tags: [environments, purpose, lifecycle, creation-rights, managed-environments, pseudo-prod, promotion]
last_reviewed: 2026-10-23
---

An environment is the unit of governance on this platform. It decides who can get in, what policies
apply, how long the thing inside it survives, and what it costs. Most arguments about process are
really arguments about which environment someone is deploying into.

**The environment sets the bar.** Build in a developer environment and almost nothing applies. Put the
same artifact in production and everything does. That single distinction does most of the work, which
is why it is worth getting the environment right before arguing about anything else.

## Types and purpose

| Type | Purpose | Not for |
| --- | --- | --- |
| **Default** | Personal productivity for everyone | Anything shared, anything anyone depends on |
| **Developer** | One person building and experimenting. Now always a Managed Environment | Shared components, anything with users beyond the maker |
| **Development sandbox** | A team building a solution together | Load-bearing use, real user data |
| **Test** | Integration and regression against production-like data | Business sign-off, live users |
| **UAT / acceptance** | Business validation before release | Ongoing use, changes |
| **Production** | Live use | Experimentation, direct edits, hotfixes |

The distinction that matters: **non-production environments are disposable, production is not.**
Anything you would be upset to lose belongs in a repo, not in an environment.

## Developer environments are now managed

Unmanaged developer environments are deprecated, along with the ones the free Power Apps Developer Plan
creates:

| Phase | Date | Effect |
| --- | --- | --- |
| Creation ends | 15 November 2026 | No new unmanaged developer environments |
| Suspension begins | 15 December 2026 | Existing unmanaged developer environments stop working |
| Deletion begins | 15 January 2027 | Removal starts; it is not necessarily a single day |

The developer environment type continues, but only as a **managed** developer environment, and each
user gets one. Until the phases complete, existing unmanaged developer environments continue to run, so
plan a migration rather than assuming they are already gone. Managed developer environments are unaffected, including the ones environment routing
creates, which are managed by default.

Two consequences. Microsoft's reason is governance: unmanaged environments sat outside Managed
Environments policies, usage insights and sharing limits, so admins had no consistent view. The
practical consequence for you is licensing, because a Managed Environment expects every active user to
hold a premium licence or capacity add-on. A self-service developer environment now has a cost attached,
which is worth knowing before encouraging everyone to create one.

**A managed environment is not a managed solution.** The environment is a licensing and governance
tier; the solution is a read-only package. A managed developer environment still holds unmanaged
solutions, and that is still how building works ([alm.md](alm.md#managed-vs-unmanaged)).

## Chains

A shared stack per organisation is a good default (`{org}-{type}`; examples here use `contoso`). A
workload gets its own dedicated chain only when it earns one. See
[dedicated chains](#dedicated-chains).

| Stack | Contents |
| --- | --- |
| Shared | `contoso-dev`, `contoso-test`, `contoso-uat`, `contoso-prod` |
| Dedicated | `contoso-{workload}-dev`, `-test`, `-uat`, `-prod` |

Region is not part of the name. Environments are created in a region and the platform records it, so
putting it in the name adds a second copy that goes stale.

Not every solution needs the full chain. Match the chain to what you are shipping:

| What you are building | Chain |
| --- | --- |
| Personal automation or experiment | Developer environment only |
| A team tool | Developer → unit dev → production |
| A business application | Unit dev → test → production |
| A core business process | Dedicated dev → test → UAT → production |

Adding a test environment to a two-person tool is overhead. Shipping a core process straight out of a
developer environment is negligence. Both happen.

## Promotion

Content moves in one direction. Production never flows back except as a restore.

```
developer → dev sandbox → test → UAT → production
```

- Managed solutions from test onward. Unmanaged in dev only.
- Data moves by repeatable script, never manual export
  ([environment-setup.md](../docs/environment-setup.md#moving-data-between-environments)).
- The only path to test and production is the pipeline ([alm.md](alm.md#getting-to-production)).

## Pseudo prod

**The most common failure mode.** A non-production environment becomes load-bearing: people use it
daily, it holds data nobody can regenerate, and cleaning it up is now a project. At that point the
pipeline is optional and the governance is fiction.

Symptoms:

- The same solution exists in dev and production with different content.
- Someone asks for a backup of a development environment.
- Users are on test because "it's faster".
- A solution in dev has not been touched in months but cannot be deleted.

Controls:

- Repo first. Unmanaged solutions live in the repo, and the copy in dev is the build source, so keep
  it. Delete abandoned duplicates rather than the source you deploy from.
- Auto shutoff. A scheduled flow turns off dev flows untouched for 24 hours.
- Sharing limits. In Managed Environments, cap dev app sharing at five users, no group sharing.
- Monitoring. Power BI flags long-lived dev solutions and high-session-count apps.
- Test TTL. Flows older than a month in test are notified, then removed, unless approved.

When something outgrows its environment, **promote it**: do not let it grow where it is. Move it up
the chain, and add version control, ownership, and documentation as it goes.

## Lifecycle and expiry

Environments without paid capacity are not guaranteed to survive:

| Type | Expiry |
| --- | --- |
| Trial | 30 days, then removed |
| Developer | Deactivated and deleted after [inactivity](https://aka.ms/3867/user-activity-definition) |
| Sandbox, production | No automatic expiry; capacity-backed |

Warnings go to environment admins, and inactivity is visible in PPAC. Any user, maker, or admin
activity resets the clock. Deleted environments stay visible in the CoE inventory with a deleted
status.

**Consequence:** a developer environment is not storage. A version-controlled solution is
([alm.md](alm.md#where-the-truth-lives)).

## Access

Access to an environment comes from an environment security group, not from individual grants
([security.md](security.md#entra-id-group-teams)). Separate groups for dev, test, and production:
the ability to deploy is not the ability to build.

Users of a shared environment's production instance should never need a maker role in it.

## Creation rights

| Type | Who can create |
| --- | --- |
| Developer (managed) | Everyone, self-service, **one per user** |
| Sandbox | Tenant admins |
| Production | Tenant admins |

Requests go through platform-team intake. Production is not created by improvisation.

Dataverse for Teams is not an option at all any more; see [below](#dataverse-for-teams-is-being-retired).

## Managed Environments

Use them where they pay for themselves; at minimum adopt
[Managed Security](https://learn.microsoft.com/power-platform/admin/security/managed-security).
Worth it when:

- The environment needs automated ALM through Power Platform pipelines.
- Application Insights is used for flow errors, in an environment already running premium solutions.
- Azure Virtual Network access is needed to reach resources without public exposure.

Licensing is the part people discover late: Managed Environments expects users to be licensed for the
premium capability they are exercising, so the cost scales with active users rather than with
environments. Check it before switching one on, and note that it now applies to developer environments
too ([above](#developer-environments-are-now-managed)).

Microsoft's [Managed Environments overview](https://learn.microsoft.com/power-platform/admin/managed-environment-overview)
is the authority on which licences qualify; it changes, and it is not worth copying into a page here.

## Default environment

Two rules:

1. **Nothing shared or business-critical lives there.** Nobody can safely govern it.
2. **Lock it down anyway**: restricted DLP, sharing limits, reactive cleanup.

The legitimate exception is what cannot run elsewhere: SharePoint form apps, and services excluded
from the developer plan such as AI Builder and Power Automate Desktop. Keep the footprint minimal
even then.

## Dedicated chains

A workload earns its own chain when it has: backlog volume, trained developers and admins,
leadership sponsorship and budget, and acceptance of risk ownership. The platform team keeps control
of test and production for separation of duty.

Per-department stacks look tidy and cost more: DLP per environment, more security groups, more access
approvals, more backups, more monitoring. Environments consume Dataverse capacity either way.

## Special workloads

| Workload | Approach |
| --- | --- |
| Copilot Studio agents | Mirrored chain for standalone agents. An agent integrated with a first-party product must share that product's environment |
| AI Builder | Separate dev environment, funnelling into shared test and production |
| Power Pages | Shared dev and test; **production per site**, because external-facing means breach isolation |
| Dataverse-heavy or sensitive data | Separate table environment owned by the data owner. Split data from app |

## Dataverse for Teams is being retired

Do not start anything here. Microsoft Dataverse for Teams is deprecated, in three phases:

| Phase | Date | Effect |
| --- | --- | --- |
| Creation ends | 15 November 2026 | No new Dataverse for Teams environments, including by creating an app or agent in a team |
| Suspended | 15 September 2027 | Environments not upgraded to Dataverse stop working; apps, flows, agents and data unavailable |
| Decommissioned | 30 October 2027 | Removed |

The constraints were always real: 2 GB of combined storage, no Dataverse Web API, no custom connectors,
no desktop flows, no AI Builder, canvas apps only, and team owners effectively holding system admin.
Those are now a moot argument, because the platform under them is going away.

What to do instead: build in a real environment and surface the result in Teams. Apps, flows and agents
built on Dataverse still work in Teams, so nothing is lost by moving.

If you own a Dataverse for Teams environment, the upgrade path keeps its apps, flows, agents and data
and unlocks the full capability set. It needs a tenant admin, and enough spare Dataverse capacity to
cover the environment's current size.

## Principles

- Plan before you build. Environment creation, region choice and the decision to provision Dataverse are
  all awkward to reverse, so get them right first.
- Keep it simple, and reuse the process the organisation already has. Low-code is not low-risk.
- Prefer platform features over hand-rolled flows:
  [environment groups and rules](https://learn.microsoft.com/power-platform/admin/environment-groups)
  automate shutoff and monitoring, and
  [Managed Environments](https://learn.microsoft.com/power-platform/admin/managed-environment-overview)
  provide sharing limits and usage insights natively.

## References

- [Microsoft: environments overview](https://learn.microsoft.com/power-platform/admin/environments-overview) · [environment strategy guidance](https://learn.microsoft.com/power-platform/guidance/adoption/environment-strategy)
- [Microsoft: secure the default environment](https://learn.microsoft.com/power-platform/guidance/adoption/secure-default-environment) · [environment cleanup](https://learn.microsoft.com/power-platform/admin/automatic-environment-cleanup)
- [Microsoft: important changes and deprecations](https://learn.microsoft.com/power-platform/important-changes-coming): the source for the Dataverse for Teams and developer environment timelines
- [Microsoft: upgrade a Dataverse for Teams environment](https://learn.microsoft.com/power-platform/admin/about-teams-environment)
