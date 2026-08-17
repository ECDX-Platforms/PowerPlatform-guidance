# Pipeline Templates

Azure DevOps pipeline YAML for Power Platform solution CI/CD.

Planned contents:

- `solution-ci.yml` — validate and build the solution on every push
- `solution-release.yml` — deploy a managed solution to an environment

Rules:

- Keep pipelines per project; copy from here rather than forking between projects.
- Add the first pipeline once the team settles on ALM tooling (e.g., PowerShell + solution import, or Azure Pipelines for Power Apps tasks).
