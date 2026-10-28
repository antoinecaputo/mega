<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import type { Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';
  import { PROBLEMS, TICKETS_REPO, splitTicket } from '#lib/kb/split';

  let { ticket }: { ticket: number } = $props();

  const split = $derived(splitTicket(reports as Report[], ticket, tenantOf, notes.oneDayMove));
</script>

<p class="sum">
  <strong>{split.total}</strong> reports merged into #{ticket} ·
  <strong>{split.rows.length}</strong> {split.rows.length === 1 ? 'problem' : 'problems'} ·
  <strong>{split.rows.filter((r) => PROBLEMS[r.problem].ticket).length}</strong> tickets
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>seen</th><th>ticket</th></tr>
  </thead>
  <tbody>
    {#each split.rows as r (r.problem)}
      {@const t = PROBLEMS[r.problem].ticket}
      <tr class:open={!t}>
        <td><code>{r.problem}</code> {PROBLEMS[r.problem].what}</td>
        <td><strong>{r.reports}</strong>{#if r.countedIn}*{/if}</td>
        <td>{r.tenants}</td>
        <td>{r.firstSeen} → {r.lastSeen}</td>
        <td>{#if t}<a href="{TICKETS_REPO}/{t}">#{t}</a>{:else}none yet{/if}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each split.rows.filter((r) => r.countedIn) as r (r.problem)}
  <p class="note">* the {r.reports} <code>{r.problem}</code> reports are also counted under <code>{r.countedIn}</code>, where the desk files them by tenant.</p>
{/each}

<style>
  .sum { font-size: 1.1rem; }
  .note { color: var(--muted); font-size: 0.85em; }
  .open td { background: var(--warn-bg); }
</style>
