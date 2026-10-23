---
title: Environment Setup
description: How to provision an environment chain and hand it over ready to build in, plus repeatable data movement
type: guide
tags: [environments, provisioning, security-groups, data, settings, checklist]
last_reviewed: 2026-10-23
---

What the platform team does to stand up a chain, and what the developer does next. The rules
behind these steps are in [environments.md](../best-practices/environments.md) and
[security.md](../best-practices/security.md).

## 1. Agree the shape

- [ ] Chain agreed: which environments this needs, and what it must survive
      ([environments.md](../best-practices/environments.md#chains)).
- [ ] Names follow `{org}-{type}`, or `{org}-{workload}-{type}` for a dedicated chain
      ([naming](../best-practices/naming.md#environments)).
- [ ] Capacity checked: Dataverse for each environment, plus add-ons.

## 2. Build the access model first

Groups have to exist before the environments do.

- [ ] Developer supplies the list of roles the solution needs.
- [ ] Environment security group created, with the developer as a named owner.
- [ ] One group per security role, nested inside the environment security group
      ([naming](../best-practices/naming.md#entra-id-groups)).

## 3. Create the environments

- [ ] Dev, test and prod created (add UAT if the solution is a core process), each with its
      environment security group attached.
- [ ] Service account in the system administrator group for test and prod.
- [ ] Dataverse provisioned with capacity for the expected data.
- [ ] Language and region set now; they are painful to change later.

## 4. Configure settings

Same checklist for every environment in the chain:

- [ ] Managed Environment enabled, with the
      [licensing consequence](../best-practices/environments.md#managed-environments) understood.
- [ ] Added to an environment group, so settings and rules apply automatically.
- [ ] Auditing on, access logging on, retention set
      ([security](../best-practices/security.md#dataverse-auditing)).
- [ ] Session expiry and inactivity timeout set.
- [ ] IP cookie binding on wherever Dataverse holds data.
- [ ] SAS token IP restriction decided.
- [ ] Content Security Policy configured ([security](../best-practices/security.md#content-security-policy)).
- [ ] DLP policy in scope and correct for this environment.
- [ ] Managed Security decided: IP firewall, CMK, lockbox, virtual network.
- [ ] Threat detection considered for agent workloads.
- [ ] Remaining settings reviewed rather than accepted by default.

## 5. Hand over

- [ ] Developers added through their groups, not individually.
- [ ] Dataverse group teams created per group, with the security role assigned.
- [ ] Test and end users added by the group owner.
- [ ] Pipeline service connection granted access to test and prod
      ([templates/pipelines/](../templates/pipelines/)).

## 6. Start building

- [ ] Unmanaged solution created in dev with the team publisher.
- [ ] Connection references and environment variables created for every environment.
- [ ] Solution exported and committed **before** writing significant logic.
- [ ] Smoke checklist started ([testing](../best-practices/release-checklist.md#testing)).

## Binding configuration per environment

A connection reference pointed at the wrong environment is the highest-damage mistake available, and
this is how you avoid it. Connection references and
environment variables exist so that the same solution points at a different target in each
environment, without being rebuilt.

**1. Create them in the solution, not in the environment.** Both are solution components. Create
them while the solution is open; anything created outside it lands in the default solution and will
not travel.

**2. Give the definition, and leave the value empty.** The definition ships. The value is per
environment.

**3. Bind per environment at deploy time.** Either:

- **Deployment settings file.** Generate one from the current environment with
  `pac solution create-settings`, edit the values for the target, then import with
  `pac solution import --settings-file`. The pipeline template does the simple version of this.
- **Set values in the target environment** after import, for the initial setup of a new chain. Do this
  once, then capture it in the settings file so it is reproducible.

**4. Verify the binding after every deployment.** Open the reference in the target environment and
confirm the connection points at that environment's target system. Do not infer it from the import
succeeding; import success says nothing about what the reference is bound to.

**5. Never put a secret in the value.** Use a Key Vault reference, or a connection reference, and let
the platform resolve it at runtime
([security.md](../best-practices/security.md#secrets-and-credentials)).

The failure this prevents: a reference left pointing at the test system, in production, where nothing
errors and the data quietly lands in the wrong place.

## Moving data between environments

Repeatable scripts only. Never manual exports.

| Approach | Use when |
| --- | --- |
| Configuration migration tool | Reference and configuration data |
| Pipeline data import step | Data that ships with a release |
| Scripted export/import via the Web API | Large or shaped datasets |

Test the movement before you need it. The first run of a data script should not be in production
under time pressure.

## Before release

- [ ] Solution Checker clean ([alm](../best-practices/alm.md#getting-to-production)).
- [ ] UAT evidence recorded.
- [ ] [Release checklist](../best-practices/release-checklist.md) walked through.
- [ ] Change approval logged.
