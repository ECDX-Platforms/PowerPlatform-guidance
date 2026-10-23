---
description: "ECDX knowledge base for Power Platform: practices, setup, and packages"
applyTo: "**"
---

# ECDX Knowledge Base

A working knowledge base for Power Platform. Content in `best-practices/` is guidance: what tends to
work and why. Apply it with judgement and say when you depart from it.

The full guide is [AGENTS.md](../AGENTS.md): routing, precedence, reading recipes, citation format,
and team terms. Read that rather than this stub, so there is only one copy to keep current.

Four things worth stating twice. The environment sets the bar first
([environments.md](../best-practices/environments.md)): build in a developer environment and almost nothing
applies, put it in production and everything does. Those pages are guidance rather than rules, so if one
looks wrong for the situation, say so and explain why rather than quietly working around it.
Never write secrets, whether a connection string, a token or a credential. And silence is not
permission: if the repo does not answer it, see [coverage.md](../docs/coverage.md) and say what you
decided instead.

`index.json` at the repo root is the machine-readable manifest: path, metadata, heading anchors,
section line ranges: if you need to route or slice without reading whole files.
