---
title: ECDX
description: "A working knowledge base for Power Platform: what tends to work, why, and the setup and decision guides that go with it"
type: meta
---

How we build on Power Platform, why we build it that way, and the tooling that does most of the
typing. Written for developers and consultants, and structured so an agent can follow the same path.

## Reading path

Work down the list. Each step assumes the one above it, and you can stop as soon as you have your
answer.

| # | Read | Because |
| --- | --- | --- |
| 0 | [Glossary](docs/glossary.md) | The vocabulary is the platform's, not ours, and much of it is counter-intuitive. Ten minutes here saves a wrong assumption later |
| 1 | [Environments](best-practices/environments.md) | Where something runs sets the bar for everything else |
| 2 | [How much process](best-practices/alm.md#how-much-process) | The environment sets the floor; criticality and data class set the rest |
| 3 | [Naming](best-practices/naming.md) | The cheapest standard to follow and the most obvious when skipped |
| 4 | [Security](best-practices/security.md) | Who owns it, who can reach it, what data is in it, what may leave |
| 5 | [Coding](best-practices/coding.md) and [AI agents](best-practices/ai-agents.md) | The building rules, once you know which category you are in |
| 6 | [Release checklist](best-practices/release-checklist.md) and [testing](docs/testing.md) | What is worth checking, and how to produce the evidence |

## Decision guides

Two questions come up before any code. The app type comes first, because it decides what the user
touches; where the logic lives follows from that and from whether the rule must hold for every write.

- **[Choosing where logic lives](docs/choosing-component.md)**: business rule, calculated or rollup
  column, low-code plug-in, JavaScript, Power Fx command, cloud flow, or C# plug-in. The answer
  usually turns on whether the rule has to hold for every write.
- **[Choosing an app type](docs/choosing-app-type.md)**: canvas, model-driven, or Code App.

## Layout

| Folder | Contents |
| --- | --- |
| [best-practices/](best-practices/) | What tends to work, and why. Start with [environments.md](best-practices/environments.md) |
| [docs/](docs/) | Glossary, decision guides, API reference, [scope statement](docs/coverage.md) |
| [dev-setup/](dev-setup/) | Editor, CLIs, MCP, and the Microsoft agent skills |
| [templates/](templates/) | Repo layout and the release pipeline |
| [packages/](packages/) | APM packages that install this guidance into a project |
| [maintenance/](maintenance/) | Repo tooling. Skip unless you are changing the knowledge base itself |
| [index.json](index.json) | Generated manifest: every doc, its metadata, headings, section line ranges |

## Starting a project

1. Decide which [environments](best-practices/environments.md) it needs. That sets the bar.
2. Confirm the [data class](best-practices/security.md#data-classification) and whether it is a core
   business process.
3. Read only the pages that situation calls for.
4. Copy the layout from [templates/project/](templates/project/) and the pipeline from
   [templates/pipelines/](templates/pipelines/).
5. Point an agent at the guidance with [`packages/`](packages/), so it does not need telling twice.

## Setting up a machine

[dev-setup/](dev-setup/) covers the editor and extensions, the `pac` and `pa` CLIs, MCP
configuration, and the Microsoft [agent skills](dev-setup/skills.md). The skills scaffold apps, flows,
plugins and pages faster than writing them by hand, and they encode vendor guidance that dates quickly.
Treat their output as a first draft: an experienced maker still validates it, and sometimes hand-authors
the part that matters.

## Using this as a knowledge base

[index.json](index.json) is the machine-readable entry point: path, `type`, `status`, `tags`,
`last_reviewed`, plus heading anchors and section line ranges for retrieval. [AGENTS.md](AGENTS.md)
defines precedence (`best-practices/` beats `docs/`), the citation format (`path#anchor`), minimum reading
per task, and what to do when a question has no answer here.

[`packages/`](packages/) turns the same guidance into an installable dependency, so a new project
inherits it by running `apm install` rather than by reading.

## For AI agents

Read [AGENTS.md](AGENTS.md) first. [.github/copilot-instructions.md](.github/copilot-instructions.md)
points there too, so there is one routing table rather than two.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security problems with anything documented here go through
[SECURITY.md](SECURITY.md).
