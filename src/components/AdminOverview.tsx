'use client';

import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {StatusDot} from '@astryxdesign/core/StatusDot';
import {Table} from '@astryxdesign/core/Table';
import {Heading, Text} from '@astryxdesign/core/Text';
import {
  ArrowRightIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import {ImproveCharts, KpiStrip} from '@/components/KpiPanel';
import type {ImproveReport} from '@/lib/improve';
import type {AggregatedKpi, ChartPoint} from '@/lib/kpis';
import type {ScarIndexEntry} from '@/lib/scars';
import type {TractionAdminRow} from '@/lib/traction';

interface CycleRow extends Record<string, unknown> {
  date: string;
  value: string;
  source: string;
  status: string;
}

interface TokenRow extends Record<string, unknown> {
  date: string;
  value: string;
  source: string;
  label: string;
}

interface TractionRow extends Record<string, unknown> {
  id: string;
  label: string;
  value: string;
  minVisible: number;
  gate: string;
  publicVisible: string;
}

interface ScarRow extends Record<string, unknown> {
  id: string;
  project: string;
  title: string;
  status: string;
  filed: string;
}

function cycleRows(reports: ImproveReport[]): CycleRow[] {
  return reports.map((report) => {
    const kpi = report.kpis.find((k) =>
      k.name.toLowerCase().includes('cycle'),
    );
    const value = kpi?.value?.trim() || 'not measured yet';
    const isBaseline =
      !kpi ||
      /not measured|baseline|^—$|^-$/i.test(value) ||
      value.length === 0;
    return {
      date: report.date,
      value: isBaseline ? 'Baseline / unpaid' : value,
      source: kpi?.source || 'no cycle-time KPI in report',
      status: isBaseline ? 'baseline' : 'measured',
    };
  });
}

function tokenRows(reports: ImproveReport[]): TokenRow[] {
  return reports.map((report) => {
    const kpi = report.kpis.find((k) =>
      k.name.toLowerCase().startsWith('token'),
    );
    const money = report.kpis.find((k) =>
      k.name.toLowerCase().includes('money'),
    );
    const value = kpi?.value?.trim() || 'not measured yet';
    const isBaseline =
      !kpi ||
      /not measured|baseline|^—$|^-$/i.test(value) ||
      value.length === 0;
    return {
      date: report.date,
      value: isBaseline ? 'Baseline / unpaid' : value,
      source: kpi?.source || 'no token feed wired',
      label:
        money?.value && money.value !== '—'
          ? money.value
          : 'Money: unpaid / not attributed',
    };
  });
}

export type AdminOverviewProps = {
  email: string;
  kpis: AggregatedKpi[];
  series: ChartPoint[];
  hasMeasured: boolean;
  reports: ImproveReport[];
  tractionRows: TractionAdminRow[];
  scars: ScarIndexEntry[];
  scarNote: string;
};

export function AdminOverviewView({
  email,
  kpis,
  series,
  hasMeasured,
  reports,
  tractionRows,
  scars,
  scarNote,
}: AdminOverviewProps) {
  const cycles = cycleRows(reports);
  const tokens = tokenRows(reports);
  const tractionTable: TractionRow[] = tractionRows.map((row) => ({
    id: row.id,
    label: row.label,
    value: row.displayValue,
    minVisible: row.minVisible,
    gate: row.gateNote,
    publicVisible: row.publicVisible ? 'yes' : 'no',
  }));
  const scarTable: ScarRow[] = scars.map((s) => ({
    id: `${s.project}/${s.filename}`,
    project: s.project,
    title: s.title,
    status: s.status,
    filed: s.filed ?? '—',
  }));

  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1} type="display-3">
          Internal improve admin
        </Heading>
        <Text type="body" color="secondary">
          Signed in as {email}. Sensitive KPI views stay behind Google SSO —
          public `/` never renders these rows. Labels stay honest: baseline /
          unpaid when no measurement exists. No invented token or $ figures.
        </Text>
      </VStack>

      <Banner
        status="info"
        title="Public vs admin"
        description="Marketing KPIs on / stay gated by measured data and traction minVisible. This admin surface may show raw nulls, below-threshold traction, and unpaid/baseline placeholders for Cos/Paul."
      />

      <VStack gap={3}>
        <Heading level={2}>KPI strip (internal labels)</Heading>
        <KpiStrip kpis={kpis} />
        <ImproveCharts series={series} hasMeasured={hasMeasured} />
      </VStack>

      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <Icon icon={SparklesIcon} size="sm" />
          <Heading level={2}>Token usage (placeholders)</Heading>
        </HStack>
        <Text type="supporting" color="secondary">
          Wired to improve-report KPI cells only. Empty → Baseline / unpaid.
        </Text>
        {tokens.length === 0 ? (
          <EmptyState
            title="No improve reports yet"
            description="Token rows appear when docs/improve/*.md exist."
          />
        ) : (
          <Table
            data={tokens}
            idKey="date"
            density="compact"
            columns={[
              {key: 'date', header: 'Date'},
              {key: 'value', header: 'Tokens'},
              {key: 'label', header: 'Money'},
              {key: 'source', header: 'Source'},
            ]}
          />
        )}
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Cycle time</Heading>
        {cycles.length === 0 ? (
          <EmptyState
            title="No cycle-time rows"
            description="Filled from improve-report Cycle time KPI when measured."
          />
        ) : (
          <Table
            data={cycles}
            idKey="date"
            density="compact"
            columns={[
              {key: 'date', header: 'Date'},
              {key: 'value', header: 'Cycle time'},
              {key: 'status', header: 'Status'},
              {key: 'source', header: 'Source / method'},
            ]}
          />
        )}
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Traction (raw, including gated)</Heading>
        <Table
          data={tractionTable}
          idKey="id"
          density="compact"
          columns={[
            {key: 'label', header: 'Metric'},
            {key: 'value', header: 'Value'},
            {key: 'minVisible', header: 'minVisible'},
            {key: 'publicVisible', header: 'Public?'},
            {key: 'gate', header: 'Gate note'},
          ]}
        />
        <Button
          label="Open traction detail"
          variant="secondary"
          href="/admin/traction"
          endContent={<Icon icon={ArrowRightIcon} size="sm" color="inherit" />}
        />
      </VStack>

      <VStack gap={3}>
        <HStack gap={2} vAlign="center">
          <Icon icon={ExclamationTriangleIcon} size="sm" />
          <Heading level={2}>Scar index</Heading>
        </HStack>
        <Text type="supporting" color="secondary">
          {scarNote}
        </Text>
        {scarTable.length === 0 ? (
          <Card padding={4}>
            <HStack gap={2} vAlign="center">
              <StatusDot variant="neutral" label="No scars filed" />
              <Text type="body" color="secondary">
                Baseline — no anonymized scars in projects/*/scars/.
              </Text>
            </HStack>
          </Card>
        ) : (
          <Table
            data={scarTable}
            idKey="id"
            density="compact"
            columns={[
              {key: 'project', header: 'Project'},
              {key: 'title', header: 'Scar'},
              {key: 'status', header: 'Status'},
              {key: 'filed', header: 'Filed'},
            ]}
          />
        )}
        <Button
          label="Open scar index"
          variant="secondary"
          href="/admin/scars"
          icon={<Icon icon={DocumentTextIcon} size="sm" color="inherit" />}
        />
      </VStack>

      <VStack gap={3}>
        <Heading level={2}>Latest improve report</Heading>
        {reports[0] ? (
          <Card padding={5} elevation="low">
            <VStack gap={3} hAlign="start">
              <Heading level={3}>{reports[0].title}</Heading>
              <Text type="supporting" color="secondary">
                {reports[0].date}
              </Text>
              <Button
                label="Full report detail"
                variant="primary"
                href="/admin/reports"
                endContent={
                  <Icon icon={ArrowRightIcon} size="sm" color="inherit" />
                }
              />
            </VStack>
          </Card>
        ) : (
          <EmptyState
            title="No reports"
            description="Add docs/improve/YYYY-MM-DD.md"
          />
        )}
      </VStack>
    </VStack>
  );
}
