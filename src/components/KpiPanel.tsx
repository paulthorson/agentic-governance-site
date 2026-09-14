'use client';

import {Card} from '@astryxdesign/core/Card';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {AggregatedKpi, ChartPoint} from '@/lib/kpis';

function MetricTile({kpi}: {kpi: AggregatedKpi}) {
  return (
    <Card padding={4} elevation={kpi.status === 'measured' ? 'low' : 'none'}>
      <VStack gap={2}>
        <Text type="supporting" color="secondary">
          {kpi.label}
        </Text>
        <Heading level={2} type="display-3">
          {kpi.displayValue}
        </Heading>
        <Text type="supporting" color="secondary">
          {kpi.status === 'baseline'
            ? `Baseline — ${kpi.source}`
            : kpi.source}
        </Text>
      </VStack>
    </Card>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{name: string; value: number | null; color: string}>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <Card padding={3} elevation="med">
      <VStack gap={1}>
        <Text type="supporting" weight="semibold">
          {label}
        </Text>
        {payload.map((entry) => (
          <Text key={entry.name} type="supporting" color="secondary">
            {entry.name}:{' '}
            {entry.value === null || entry.value === undefined
              ? 'not measured'
              : String(entry.value)}
          </Text>
        ))}
      </VStack>
    </Card>
  );
}

export function KpiStrip({kpis}: {kpis: AggregatedKpi[]}) {
  return (
    <HStack gap={4} wrap="wrap">
      {kpis.map((kpi) => (
        <VStack key={kpi.kind} maxWidth={220} width="100%">
          <MetricTile kpi={kpi} />
        </VStack>
      ))}
    </HStack>
  );
}

export function ImproveCharts({
  series,
  hasMeasured,
}: {
  series: ChartPoint[];
  hasMeasured: boolean;
}) {
  if (!hasMeasured) {
    return (
      <Card padding={5}>
        <EmptyState
          title="Charts waiting on measured KPIs"
          description="Baseline day is honest: no invented series. When docs/improve reports include measured tokens, cycle time, retros, or AG PRs, this chart fills from that feed."
        />
      </Card>
    );
  }

  return (
    <Card padding={5} elevation="low">
      <VStack gap={3}>
        <Heading level={3}>
          Improve trends (measured points only)
        </Heading>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={series} margin={{top: 8, right: 12, left: 0, bottom: 8}}>
            <CartesianGrid
              horizontal
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="date"
              tick={{fill: 'var(--color-text-secondary)', fontSize: 12}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{fill: 'var(--color-text-secondary)', fontSize: 12}}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<ChartTooltip />} />
            <Line
              type="monotone"
              dataKey="gains"
              name="Gains"
              stroke="var(--color-data-categorical-blue)"
              strokeWidth={2}
              connectNulls={false}
              dot
            />
            <Line
              type="monotone"
              dataKey="retros"
              name="Retros"
              stroke="var(--color-data-categorical-green)"
              strokeWidth={2}
              connectNulls={false}
              dot
            />
            <Line
              type="monotone"
              dataKey="agPrs"
              name="AG PRs"
              stroke="var(--color-data-categorical-orange)"
              strokeWidth={2}
              connectNulls={false}
              dot
            />
            <Line
              type="monotone"
              dataKey="cycleTime"
              name="Cycle time"
              stroke="var(--color-data-categorical-purple)"
              strokeWidth={2}
              connectNulls={false}
              dot
            />
          </LineChart>
        </ResponsiveContainer>
        <Text type="supporting" color="secondary">
          Null days stay gaps — never filled with guesses.
        </Text>
      </VStack>
    </Card>
  );
}
