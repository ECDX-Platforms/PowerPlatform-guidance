---
title: Best Practices
description: What tends to work on Power Platform, and why. Guidance and reasoning, not rules to comply with
type: index
---

What tends to work, and the reasoning behind it. None of this is a rule you have to comply with. It is
what people who have built this stuff have found holds up, written so you can judge whether it applies
to your situation.

Where a page disagrees with your circumstances, your circumstances win. Come back and change the page.

## Where to start

**[environments.md](environments.md)** is the spine: the environment you deploy into sets the bar for
everything else. Read it first, then only the pages that situation calls for.

| # | Page | Answers |
| --- | --- | --- |
| 1 | [environments.md](environments.md) | Where does this run, what is that environment for, and how long does it live? |
| 2 | [alm.md](alm.md) | How much process is worth applying, how does it reach production, how is it recovered? |
| 3 | [naming.md](naming.md) | What should I call it? |
| 4 | [security.md](security.md) | Who owns it, who can reach it, what data is in it, what can leave? |
| 5 | [release-checklist.md](release-checklist.md) | What is worth checking before people depend on it? |

Guidance for the build itself:

| Page | Covers |
| --- | --- |
| [coding.md](coding.md) | Canvas apps, flows, plugins, Code Apps |
| [ai-agents.md](ai-agents.md) | Copilot Studio agents and AI features |

## How to read this

Each page states what works and why. That "why" is the useful part: it tells you when the advice stops
applying. A practice stated without its reason is a rule, and rules age badly on a platform that ships
monthly.

Pages carry a `last_reviewed` date. Platform behaviour moves, so treat anything older than a few months
as a starting point to verify rather than a fact.

## Contributing

If you have learned something that contradicts what is here, that is the most valuable contribution
available. See [CONTRIBUTING.md](../CONTRIBUTING.md).

| Folder | Holds |
| --- | --- |
| [docs/](../docs/) | Explanations, decision guides, glossary |
| [dev-setup/](../dev-setup/) | Getting a machine ready |
| [templates/](../templates/) | Starting points to copy |
| [packages/](../packages/) | The same guidance, installable with `apm` |
| [maintenance/](../maintenance/) | Repo tooling, not content |
