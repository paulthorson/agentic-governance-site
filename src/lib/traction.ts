import {fetchAgJson} from '@/lib/ag-feeds';

export type TractionMetric = {
  id: string;
  label: string;
  value: number | null;
  minVisible: number;
  href: string | null;
  unit: string;
};

export type TractionConfig = {
  updatedAt: string | null;
  sourceNote: string;
  repoPublicRequired: boolean;
  metrics: Record<string, TractionMetric>;
};

const EMPTY_TRACTION: TractionConfig = {
  updatedAt: null,
  sourceNote:
    'Traction feed unavailable from AG (read-only pull failed). Widgets stay hidden — never invent numbers.',
  repoPublicRequired: true,
  metrics: {},
};

/**
 * Pull measured traction from AG publisher.
 * Prefer root data/traction.json; fall back to dashboard/data/traction.json.
 */
export async function loadTractionConfig(): Promise<TractionConfig> {
  const fromRoot = await fetchAgJson<TractionConfig>('data/traction.json');
  if (fromRoot?.metrics) return fromRoot;

  const fromDashboard = await fetchAgJson<TractionConfig>(
    'dashboard/data/traction.json',
  );
  if (fromDashboard?.metrics) return fromDashboard;

  return EMPTY_TRACTION;
}

/** Fully wired widgets; visibility is config-only (value + minVisible). */
export function visibleTractionMetrics(
  config: TractionConfig,
): TractionMetric[] {
  return Object.values(config.metrics).filter((metric) => {
    if (metric.value === null || metric.value === undefined) return false;
    return metric.value >= metric.minVisible;
  });
}

export function hiddenTractionCount(config: TractionConfig): number {
  const all = Object.values(config.metrics);
  return all.length - visibleTractionMetrics(config).length;
}

export type TractionAdminRow = TractionMetric & {
  publicVisible: boolean;
  displayValue: string;
  gateNote: string;
};

/**
 * Admin-only: raw traction rows even when below minVisible or null.
 * Public surface must keep using visibleTractionMetrics().
 */
export function allTractionAdminRows(
  config: TractionConfig,
): TractionAdminRow[] {
  return Object.values(config.metrics).map((metric) => {
    const hasValue = metric.value !== null && metric.value !== undefined;
    const publicVisible = hasValue && metric.value! >= metric.minVisible;
    let displayValue = 'not measured';
    let gateNote = 'null value — hidden on public';
    if (hasValue) {
      displayValue = String(metric.value);
      gateNote = publicVisible
        ? `≥ minVisible (${metric.minVisible}) — public`
        : `below minVisible (${metric.minVisible}) — gated on public`;
    }
    return {...metric, publicVisible, displayValue, gateNote};
  });
}
