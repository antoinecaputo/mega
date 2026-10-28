// #4471 split by what each report shows, not by what intake tagged it. One problem, one ticket.
import { causeOf, uniqueById, type Report, type Tenant } from '#lib/kb/causes';

// `shift`: the date moved by one day, day and month in order. Not the parser, not the hint:
// the desk reads these one by one (desk-notes.json → oneDayMove).
export type Problem = 'parser' | 'hint' | 'shift' | 'unplaced';

export const PROBLEMS: Record<Problem, { what: string; ticket: number | null }> = {
  parser: { what: 'shared parser reads day-first dates month first: day and month swap', ticket: 1 },
  hint: { what: 'booking-v3 form hint says MM/DD/YYYY, the form reads day first', ticket: 2 },
  shift: { what: 'date moves by one day, no swap: timezone', ticket: 3 },
  unplaced: { what: 'no tenant on file: read it before filing', ticket: null },
};

export const TICKETS_REPO = 'https://github.com/antoinecaputo/mega/issues';

export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem {
  if (oneDayMove.includes(r.id)) return 'shift';
  return causeOf(r, t) ?? 'unplaced';
}

export type ProblemRow = { problem: Problem; reports: Report[]; tenants: number; firstSeen: string; lastSeen: string; taggedRight: number };

export function splitTicket(
  all: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): { total: number; rows: ProblemRow[] } {
  const merged = uniqueById(all).filter((r) => r.mergedInto === ticket);
  const by = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r), oneDayMove);
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  const rows = [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
        taggedRight: rs.filter((r) => r.meta.intakeTag === problem).length,
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
  return { total: merged.length, rows };
}
