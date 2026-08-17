# ECDX

Team knowledge base for the D365 / Power Platform team: standards, documentation, and boilerplate templates for starting new projects.

## Sections

| Section | What's in it |
| --- | --- |
| [docs/](docs/) | Architecture decisions (ADRs), how-to guides, reference material |
| [best-practices/](best-practices/) | Team standards: coding, testing, security, delivery & ALM |
| [templates/](templates/) | Boilerplate for new projects: project scaffold, ADR template, pipeline YAML |

## Starting a new project?

1. Copy the layout from [templates/project/](templates/project/) into the new repo.
2. Fill in its `README.md` from [templates/project/readme-template.md](templates/project/readme-template.md).
3. Follow the standards in [best-practices/](best-practices/) — especially [delivery/](best-practices/delivery/) for ALM.
4. Record significant design decisions as ADRs using [templates/docs/adr-template.md](templates/docs/adr-template.md).

## Contributing knowledge

- **Standard** ("we do it this way") → `best-practices/<area>/`
- **Explanation** ("how do I…?") → `docs/guides/` or `docs/reference/`
- **Starting point** (copy and adapt) → `templates/<area>/`

Keep entries short, actionable, and in kebab-case filenames.
