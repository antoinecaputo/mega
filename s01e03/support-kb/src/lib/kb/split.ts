// #4471 split into one ticket per problem. Counted the desk's way (causes.ts, CauseTable): a report
// counts under the cause its tenant and way in give it. Reports the desk read as something else
// (desk-notes.json) stay counted there and get a row of their own, footnoted.
import { groupByCause, readAs, uniqueById, type CauseGroup, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = CauseGroup['cause'] | 'shift';

export const PROBLEMS: Record<Problem, { what: string; ticket: number | null }> = {
  parser: { what: 'shared parser reads day-first dates month first: day and month swap', ticket: 1 },
  hint: { what: 'booking-v3 form hint says MM/DD/YYYY, the form reads day first', ticket: 2 },
  shift: { what: 'date moves by one day, no swap: timezone', ticket: 3 },
  unplaced: { what: 'no tenant on file: read it before filing', ticket: null },
};

export const TICKETS_REPO = 'https://github.com/antoinecaputo/mega/issues';

export type ProblemRow = { problem: Problem; reports: number; tenants: number; firstSeen: string; lastSeen: string; countedIn: Problem | null };

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; rows: ProblemRow[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const groups = groupByCause(merged, tenantOf);
  const rows: ProblemRow[] = groups.map((g) => ({
    problem: g.cause, reports: g.reports.length, tenants: g.tenants, firstSeen: g.firstSeen, lastSeen: g.lastSeen, countedIn: null,
  }));
  for (const g of groups) {
    const moved = g.reports.filter((r) => oneDayMove.includes(r.id));
    if (readAs(g, oneDayMove) === 0) continue;
    const days = moved.map((r) => r.receivedAt.slice(0, 10)).sort();
    rows.push({
      problem: 'shift', reports: moved.length, tenants: new Set(moved.map((r) => r.tenant)).size,
      firstSeen: days[0], lastSeen: days[days.length - 1], countedIn: g.cause,
    });
  }
  return { total: merged.length, rows };
}
