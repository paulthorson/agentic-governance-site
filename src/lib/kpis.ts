import type {ImproveKpi, ImproveReport} from './improve';

export type KpiKind = 'tokens' | 'cycleTime' | 'retros' | 'agPrs' | 'gains';

export type AggregatedKpi = {
  kind: KpiKind;
  label: string;
  displayValue: string;
  source: string;
  status: 'measured' | 'baseline';
  /** Numeric only when measured; never invent. */
  numericValue: number | null;
};

export type ChartPoint = {
  date: string;
  tokens: number | null;
  cycleTime: number | null;
  retros: number | null;
  agPrs: number | null;
  gains: number | null;
};

function normalizeKpiName(name: string): KpiKind | null {
  const key = name.trim().toLowerCase();
  if (key.startsWith('token')) return 'tokens';
  if (key.includes('cycle')) return 'cycleTime';
  if (key.startsWith('retro')) return 'retros';
  if (key.includes('ag pr') || key === 'ag prs') return 'agPrs';
  if (key.startsWith('gain')) return 'gains';
  return null;
}

function parseMeasuredNumber(value: string): number | null {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed || trimmed === '—' || trimmed === '-') return null;
  if (trimmed.includes('not measured') || trimmed.includes('baseline')) {
    return null;
  }
  const match = trimmed.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const n = Number(match[0]);
  return Number.isFinite(n) ? n : null;
}

function latestKpi(
  reports: ImproveReport[],
  kind: KpiKind,
): ImproveKpi | null {
  for (const report of reports) {
    for (const kpi of report.kpis) {
      if (normalizeKpiName(kpi.name) === kind) return kpi;
    }
  }
  return null;
}

const LABELS: Record<KpiKind, string> = {
  tokens: 'Tokens',
  cycleTime: 'Cycle time',
  retros: 'Retros filed',
  agPrs: 'AG PRs',
  gains: 'Daily improve gains',
};

/**
 * Build the marketing KPI strip from improve reports.
 * Unmeasured cells stay baseline — never invent numbers.
 */
export function aggregateKpis(reports: ImproveReport[]): AggregatedKpi[] {
  const kinds: KpiKind[] = ['gains', 'cycleTime', 'retros', 'agPrs', 'tokens'];

  return kinds.map((kind) => {
    if (kind === 'gains') {
      const latest = reports[0];
      const count = latest?.gains.length ?? 0;
      if (!latest || count === 0) {
        return {
          kind,
          label: LABELS[kind],
          displayValue: 'Baseline',
          source: 'No gains bullets in latest report',
          status: 'baseline' as const,
          numericValue: null,
        };
      }
      // Count of stated gains is observable from the report text, not invented.
      return {
        kind,
        label: LABELS[kind],
        displayValue: String(count),
        source: `${latest.date} report — count of Gains bullets`,
        status: 'measured' as const,
        numericValue: count,
      };
    }

    const kpi = latestKpi(reports, kind);
    const numeric = kpi ? parseMeasuredNumber(kpi.value) : null;
    if (numeric === null) {
      return {
        kind,
        label: LABELS[kind],
        displayValue: 'Baseline',
        source: kpi?.source || 'not measured yet',
        status: 'baseline' as const,
        numericValue: null,
      };
    }
    return {
      kind,
      label: LABELS[kind],
      displayValue: String(numeric),
      source: kpi?.source || 'improve report',
      status: 'measured' as const,
      numericValue: numeric,
    };
  });
}

/** Time series for charts — null points mean “not measured that day”. */
export function buildKpiChartSeries(reports: ImproveReport[]): ChartPoint[] {
  // reports are newest-first; chart wants oldest → newest
  return [...reports].reverse().map((report) => {
    const point: ChartPoint = {
      date: report.date,
      tokens: null,
      cycleTime: null,
      retros: null,
      agPrs: null,
      gains: report.gains.length > 0 ? report.gains.length : null,
    };
    for (const kpi of report.kpis) {
      const kind = normalizeKpiName(kpi.name);
      if (!kind || kind === 'gains') continue;
      point[kind] = parseMeasuredNumber(kpi.value);
    }
    return point;
  });
}

export function hasAnyMeasuredChartPoint(series: ChartPoint[]): boolean {
  return series.some(
    (p) =>
      p.tokens !== null ||
      p.cycleTime !== null ||
      p.retros !== null ||
      p.agPrs !== null ||
      p.gains !== null,
  );
}
