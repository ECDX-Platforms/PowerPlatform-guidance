---
title: Solutions and ALM
description: What a solution is, managed vs unmanaged by environment, complexity, where the truth lives, getting to production, and documentation
type: practice
tags: [solutions, alm, managed, unmanaged, dependencies, environment-variables, version-control, documentation, complexity]
last_reviewed: 2026-10-23
---

## What a solution is

Not a box: a **list**. A component can appear in many solutions, and editing it in one changes it
everywhere, because it is a single row in Dataverse. Two states exist: the cloud (Dataverse rows)
and the artifact (a zip of XML, JSON, msapp).

This is why "which solution owns this table?" has no clean answer, and why dependencies are what
break imports.

## Managed vs unmanaged

| Environment | Solution type |
| --- | --- |
| Default | Unmanaged (personal solutions only) |
| Developer (now always a managed environment) | Unmanaged solutions |
| Sandbox (development) | Unmanaged solutions |
| Sandbox (test) | Managed |
| Production | Managed |

- Unmanaged solutions in dev only, managed everywhere else. This is the practice that makes ALM work.
- Two things share the word "managed" and confusing them causes real trouble: a **managed
  environment** is a licensing and governance tier, while a **managed solution** is a read-only
  package. Developer environments are becoming managed *environments*
  ([environments.md](environments.md#developer-environments-are-now-managed)); they still hold
  unmanaged *solutions*.
- The only supported unmanaged customizations in test and prod: environment variable values and
  connection reference bindings.
- Check the type at import. An unmanaged import into prod cannot be undone cleanly.

## Solution layers

A layer sits on top of a managed component and changes it without editing it. Two very different things
get called this, and treating them as one causes bad decisions.

**A managed layer from your own solution is the supported way to customise a managed solution.** If you
build on a Microsoft first-party solution, every form, view or command bar change you make lands in a
layer above Microsoft's managed component. That is the designed mechanism, and there is no version of
that work where it does not happen. Extend the components Microsoft marks as customisable, in your own
solution and with your own publisher.

**An unmanaged layer from editing production is the problem.** Someone changes a managed component
directly in the production environment, the change survives the next import, and the repo now describes
something that is not running. Two truths, no way to tell which is real.

So the thing to avoid is unmanaged customisation of production, not layering. The practical habits:

- Customise in development, in your own solution, and promote it.
- Check which layer sits on top before editing a component you did not create, because Microsoft's
  baseline and your own solution can both have one.
- Treat a managed upgrade as a merge problem: your layer may conflict with a changed Microsoft
  component, and that is discovered by testing the wave, not by hoping.

## Complexity

Complexity tells you how much engineering effort to expect, not how much governance applies. Rough
shape is enough:

| | **Small** | **Medium** | **Large** |
| --- | --- | --- | --- |
| **Integrations** | Nothing beyond Microsoft 365 | Azure, another cloud, REST or custom connectors | Systems outside the Microsoft cloud |
| **Automations** | Templates, simple connectors | Parent/child flows, JSON or XML parsing | Multi-service orchestration, Graph API, synchronous execution |
| **Apps** | Simple canvas over lists | Dataverse beyond a few tables, or Azure SQL | Several apps, mixed sources, virtual tables |
| **Security model** | Few roles, equal access | Several distinct access levels | Layered model designed per solution |
| **Environments** | Developer environment | Shared stack | Dedicated chain |

Complexity is a poor proxy for risk. A simple solution touching payroll data still deserves the full
treatment; blast radius is the better question, and that lives in
[How much process](#how-much-process).

## How much process

Rigour tends to follow **where it runs**, not what the solution is called. The useful question is not
"is this a big project" but "which environment is this going into, and what happens if it breaks".

| Going into | Managed solution | Version control | Pipeline | Documentation | Owner |
| --- | --- | --- | --- | --- | --- |
| Developer environment (managed environment) | Unmanaged solution | Optional | No | None | The maker |
| Development sandbox | Unmanaged solution | Worth doing | No | Light | The maker |
| Test | Yes | Yes | Yes | As below | Service account |
| UAT | Yes | Yes | Yes | As below | Service account |
| Production | Yes | Yes | Yes | As below | Service account |

The production row is where the effort earns its keep. Below it most of these are optional, and
applying them to an experiment wastes time and teaches people to ignore checklists.

Then raise the bar for what the solution is worth to the business. Two questions:

- **Is this a core business process?** If it stopping causes real disruption rather than
  inconvenience, two things are worth adding that a normal release does not call for: UAT signed off
  by the business rather than only by the builders, and a system owner distinct from the person who
  built it.
- **What data does it touch?** Confidential, personal, or regulated data means auditing,
  field-level security, and a documented retention position: whatever the audience size
  ([security.md](security.md#data-classification)).

A technically simple solution can still be critical enough to need its own chain. Complexity is a
poor proxy for risk; blast radius is a good one.

### Is it a core business process?

One test, applied literally: **if this stopped working for a day, would the business stop or would
people be inconvenienced?** Stopping means a process cannot run, a payment cannot be made, a
regulatory obligation is missed, or revenue stops. Inconvenienced means someone does it by hand or
waits. If you cannot answer the question, it is not core; default to the lower bar and revisit when
someone can name the process it blocks.

That classification is worth agreeing with a named business owner rather than self-assigning, because
it is the owner who takes on the UAT and the on-call obligation.

## Where the truth lives

The repository is usually the most durable record. A dev environment gets reset, a maker's OneDrive
leaves with their account, and a vendor tenant is not yours.

- Unmanaged solution files are exported and committed. The pipeline exports the current dev state,
  checks it, and produces the managed artifact for release, so the repo is the record rather than the
  build input. Anything in dev that is uncommitted will still ship, which is why dev stays clean and
  a committed export that differs from dev is a bug to fix before release.
- A solution that exists only in an environment is hard to recover and hard to argue is yours.
- Passing raw solution zips around works for a one-off handover, but it leaves no history, so it
  rarely survives a second release.
- `main` is releasable; feature branches carry change sets ([naming](naming.md#azure-devops)).

## Getting to production

A pipeline is the path that keeps working once more than one person is involved. Manual imports are
fine until someone imports on a Friday, and that is the day the repo stops matching production.

- Let a service connection deploy rather than a person. It removes the "works on my machine" class of
  problem and leaves a log.
- Run [Solution Checker](https://learn.microsoft.com/power-apps/maker/data-platform/use-powerapps-checker)
  before export, and aim for zero critical or high findings. It catches missing dependencies and
  unoperable patterns; it is not a bug detector.
- Data movement is easier to trust as a script than as a manual export
  ([environment-setup.md](../docs/environment-setup.md#moving-data-between-environments)).
- Start from [templates/pipelines/](../templates/pipelines/). Before hand-rolling more YAML,
  evaluate [Power Platform pipelines](https://learn.microsoft.com/power-platform/alm/pipelines) and
  the [ALM Accelerator](https://learn.microsoft.com/power-platform/guidance/alm-accelerator/overview).

## Environment variables and connection references

- Definition and value are separate tables. That split is the feature: values differ per environment.
- They work best when solution-specific. Sharing one across solutions, or letting it be auto-created
  on import, tends to produce bindings nobody expected.
- Point at the right target per environment. A connection reference aimed at test in prod writes
  production data into the wrong place, quietly.
- Secrets do not belong in a value ([security.md](security.md#secrets-and-credentials)).
- You cannot export what you cannot see. If makers can't see each other's components, share them.

## Dependencies

Everything the solution needs lives **in** it, with two deliberate exceptions: custom connectors
and shared Dataverse tables, which have a different lifecycle.

A table dependency is worth treating as a cost. It is the most common cause of a failed import, and the
usual reason to split one solution into two.

## Documentation

| Going into | Requirement |
| --- | --- |
| Developer environment, dev sandbox | Light: owner, audience, approximate user count, purpose, component list, data sources |
| Test, UAT, production | Full |
| Core business process | Full, plus a runbook and a named system owner |

**Full** means two documents in the repo:

- **PDD**: product design: purpose, users, requirements, acceptance criteria, data classification.
- **SDD**: solution design: components, data model, integrations, security model, environments, operations.

Documentation drifts, and it is still the only record of what was *intended*, which is what you want
when something behaves oddly two years later. Writing it before go-live is easier than reconstructing
it afterwards.

## Tech debt

Low-code multiplies tech debt three ways: volume, because everyone can build; lifecycle, because things
start personal and grow or lose their maker; and the missing engineering reflex, because nobody
reviewed it.

The end state is the orphaned solution: too critical to turn off, with nobody left who can change it.
It arrives without anyone deciding to create it, which is why it is worth watching for deliberately.

The counterweights are the rest of this repo. Naming and structure make a solution readable by the
next person; [environments.md](environments.md#pseudo-prod) covers the monitoring that flags something
growing past its environment; [Documentation](#documentation) covers the record of intent.

AI generation multiplies all three at once: more volume, faster, and less readable to whoever inherits
it. Under AI assistance, documentation and review matter more rather than less.

## Lifecycle

Security controls are much cheaper to design in than to retrofit, which is why this list follows the
stages rather than the code.

| Stage | The useful habit |
| --- | --- |
| **Plan** | Decide the auth model, access model and non-functional requirements before building. Retrofitting them is the expensive version |
| **Make** | Someone senior reads the design, not just the code |
| **Package** | Everything the solution needs travels inside it, except the declared exceptions |
| **Test** | Automated where it pays, and testers who are not the builders |
| **Deploy** | Pipeline with a human approval, so there is a record of who released what |
| **Operate** | Rotate secrets on schedule, remove access that has stopped being used |
| **Monitor** | Alerts on failure rate, fed by Application Insights per environment |

Two habits from this list are worth calling out because they are cheap and commonly skipped: flows
with exception handling that notifies someone with the failed-run link, and an operations team with an
agreed response time rather than a best-effort one.

## References

- [Microsoft: solution concepts and ALM](https://learn.microsoft.com/power-platform/alm/solution-concepts-alm)
- [coe-alm-accelerator-templates](https://github.com/microsoft/coe-alm-accelerator-templates) · [PowerApps-Samples](https://github.com/microsoft/PowerApps-Samples)
- [Microsoft: solution layers and managed properties](https://learn.microsoft.com/power-platform/alm/solution-layers-alm)
- [Microsoft: Power Platform Build Tools](https://learn.microsoft.com/power-platform/alm/devops-build-tools) · [branching guidance](https://learn.microsoft.com/azure/devops/repos/git/git-branching-guidance)
