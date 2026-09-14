'use client';

import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Table} from '@astryxdesign/core/Table';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {ImproveReport} from '@/lib/improve';

interface CycleRow extends Record<string, unknown> {
  date: string;
  value: string;
  status: string;
  source: string;
}

function rowsFromReports(reports: ImproveReport[]): CycleRow[] {
  return reports.map((report) => {
    const kpi = report.kpis.find((k) =>
      k.name.toLowerCase().includes('cycle'),
    );
    const raw = kpi?.value?.trim() || '';
    const isBaseline =
      !kpi ||
      raw.length === 0 ||
      /not measured|baseline|^—$|^-$/i.test(raw);
    return {
      date: report.date,
      value: isBaseline ? 'Baseline / unpaid' : raw,
      status: isBaseline ? 'baseline' : 'measured',
      source: kpi?.source || 'no cycle-time definition yet',
    };
  });
}

export function AdminCycleTimeView({reports}: {reports: ImproveReport[]}) {
  const rows = rowsFromReports(reports);

  return (
    <VStack gap={5}>
      <VStack gap={2}>
        <Heading level={1} type="display-3">
          Cycle time
        </Heading>
        <Text type="body" color="secondary">
          Internal table from improve-report Cycle time KPI cells. Definition
          must be stated in the Source column when measured.
        </Text>
      </VStack>

      {rows.length === 0 ? (
        <EmptyState
          title="No cycle-time rows"
          description="Add dated improve reports with a Cycle time KPI."
        />
      ) : (
        <Table
          data={rows}
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
  );
}
