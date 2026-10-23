<!--
Which area does this touch: best-practices/, docs/, dev-setup/, templates/, packages/, maintenance/?
If you are changing guidance, say which environment and data class it applies to and why the current
wording was wrong.
-->

## What changed

-

## Checklist

- [ ] `node maintenance/scripts/build-index.mjs && node maintenance/scripts/check.mjs` passes
- [ ] `index.json` regenerated and committed
- [ ] Frontmatter complete: `type`, plus `tags` and `last_reviewed` on practice and reference pages
- [ ] Folder README index updated if a file was added, renamed, or removed
- [ ] Nothing duplicated: link to the original instead, so the two copies cannot drift
- [ ] Every `##` section still makes sense if read alone (retrieval slices at headings)
