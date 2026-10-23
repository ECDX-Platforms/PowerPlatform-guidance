---
title: Security
description: How to report a security concern with content in this knowledge base
type: meta
---

# Reporting a security concern

This repo is documentation, templates, and standards. It ships nothing to exploit directly.
The risk is different: a standard or example here could itself be insecure and get copied into
real projects, where it will look authoritative.

## Report it

If you find an insecure example, a dangerous recommendation, or a control described
incorrectly: for example in [security.md](best-practices/security.md) or
[dlp coverage](best-practices/security.md#dlp-policies):

1. Do not open a public issue.
2. Contact the repo owners through the team's internal channel.
3. Include the file path, the section, and why you believe it is wrong.

## What happens next

The team reviews the report, corrects the doc, and updates `last_reviewed` in the frontmatter
of anything touched. Fixes land as normal PRs once confirmed.

## Related

- [security.md](best-practices/security.md): the standards themselves
- [CONTRIBUTING.md](CONTRIBUTING.md): general contribution rules
