# S01E03 · what it shows

The support desk merged 412 reports into ticket #4471 and marked it known. It is three problems:

| problem | reports | ticket |
|---|---|---|
| shared parser reads day-first dates month first (day/month swap) | 374 | [#1](https://github.com/antoinecaputo/mega/issues/1) |
| booking-v3 form hint says `MM/DD/YYYY`, form reads day first | 33 | [#2](https://github.com/antoinecaputo/mega/issues/2) |
| date moves by one day, no swap (timezone) | 5 | [#3](https://github.com/antoinecaputo/mega/issues/3) |

- kb export: `support-kb/` (as received, `kb-export-267efc5e.zip`)
- my page (.svx): [`support-kb/src/routes/kb/incidents/4471-split/+page.svx`](support-kb/src/routes/kb/incidents/4471-split/+page.svx), logic in `support-kb/src/lib/kb/split.ts` and `SplitTable.svelte`
- the page as the desk sees it: [`rendered/kb/incidents/4471-split/index.html`](rendered/kb/incidents/4471-split/index.html) (SvelteKit + mdsvex static build of `support-kb/src`; desk ref `DR-1FBR-VFR3`)
