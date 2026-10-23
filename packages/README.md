---
title: APM Packages
description: Installable packages that carry this guidance and review behaviour into any Power Platform project
type: index
---

# APM packages

Ready-made [APM](https://github.com/microsoft/apm) packages that carry this guidance into a
project, so nobody has to paste instructions into a prompt or re-explain the environment model.

`apm install` puts the package's instructions and skills where the chosen agent harness reads them,
and configures any MCP servers the package declares. One manifest, reproducible on every machine.

## The packages

| Package | For | Carries |
| --- | --- | --- |
| [`power-platform-practices`](power-platform-practices/) | Every project | Environment model, practices, checklist; two skills; Learn MCP |
| [`governance-review`](governance-review/) | Reviewers and consultants | Review posture (read-only, evidence over opinion), security and DLP review skill |
| [`agent-authoring`](agent-authoring/) | Copilot Studio work | Agent rules, readiness review skill, Copilot Studio MCP server |

Overlap is deliberate and small: `power-platform-practices` holds the rules, the other two hold the
*review* behaviour and point at the same items. Nothing restates guidance that lives elsewhere.

## Install

```bash
# everything, for a project that builds and reviews
apm install <org>/<repo>/packages/power-platform-practices
apm install <org>/<repo>/packages/governance-review

# agent work on top
apm install <org>/<repo>/packages/agent-authoring
```

Pin a ref in a project so the guidance does not move under it:

```yaml
# apm.yml in the consuming project
dependencies:
  apm:
    - git: <org>/<repo>
      path: packages/power-platform-practices
      ref: v0.1.0
```

The object form with `git:` and `path:` is the unambiguous way to reference a package inside a
monorepo. The shorthand `<org>/<repo>/packages/x#v0.1.0` also works.

`apm install` needs at least one target. Declare it in the consuming project (`targets: [copilot]`)
rather than relying on auto-detection, or `apm install` fails closed.

## Authoring and validating

Packages are source, not build output. Commit `apm.yml` and `.apm/`; never commit `.github/`,
`.agents/`, `apm_modules/`, or `apm.lock.yaml` from a package directory: those are generated where
the package is consumed.

```bash
cd packages/power-platform-practices
apm compile --validate        # frontmatter and structure
apm install --target copilot  # confirm it deploys
apm pack --dry-run -v         # see exactly what a consumer receives
```

Then delete the generated output again:

```bash
rm -rf .github .agents apm_modules apm.lock.yaml build
```

## Layout rules that are easy to get wrong

- Instructions live in `.apm/instructions/`. Root-level `instructions/` is not scanned by
  `apm install`: the guardrail installs silently incomplete.
- **Skills live in `.apm/skills/<name>/SKILL.md`**, and the frontmatter `name` must equal the
  directory name, or the directory wins and the declared name is ignored.
- `applyTo:` on every instruction. Without it, a scoped rule silently becomes global.
- **MCP servers are declared in `apm.yml`**, not as files.
- **Only `name` and `version` are required** in `apm.yml`, but declare `targets:` so output is
  deterministic for every developer and CI runner.

## Versioning

Each package carries its own `version`. Bump it when the guidance changes, and tag the repo
(`v0.1.0`) so consumers can pin. Publishing needs no registry: a git tag is enough.
