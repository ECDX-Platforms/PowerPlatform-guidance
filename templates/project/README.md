---
title: Project Template
description: Starting layout for a new project repo, with README, PDD and SDD templates and a gitignore
type: template
---

Starting point for a new project. Copy this layout into the new repo, then fill in `README.md`
from [readme-template.md](readme-template.md).

```
my-project/
├── .gitignore           # from .gitignore here: bin/, obj/, dist/, node_modules/
├── README.md            # from readme-template.md
├── docs/
│   ├── pdd.md           # from pdd-template.md
│   └── sdd.md           # from sdd-template.md
├── solutions/           # exported solution files
├── src/                 # plugin, web resource, or Code App source
└── pipelines/           # CI/CD, from ../../templates/pipelines/
```

## Steps

1. Copy the layout. Take `readme-template.md` as `README.md`, `pdd-template.md` and
   `sdd-template.md` as files under `docs/`, and the `.gitignore` as-is. Replace every
   `<placeholder>`: a template still containing them is worse than none, because it looks finished.
2. Decide which [environments](../../best-practices/environments.md#chains) it needs. That decides which folders you actually need.
3. Set up the environment chain ([environment-setup.md](../../docs/environment-setup.md)).
4. Commit the first solution export before writing significant logic, so history starts at the beginning.
5. The PDD and SDD earn their place from test onward. A developer-environment experiment does
   not need them, so leave `docs/` empty until it moves.
