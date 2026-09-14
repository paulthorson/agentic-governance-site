'use client';

import {Banner} from '@astryxdesign/core/Banner';
import {Table} from '@astryxdesign/core/Table';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {TractionAdminRow} from '@/lib/traction';

interface Row extends Record<string, unknown> {
  id: string;
  label: string;
  value: string;
  minVisible: number;
  publicVisible: string;
  gate: string;
  unit: string;
}

export function AdminTractionView({
  rows,
  sourceNote,
  updatedAt,
}: {
  rows: TractionAdminRow[];
  sourceNote: string;
  updatedAt: string | null;
}) {
  const table: Row[] = rows.map((row) => ({
    id: row.id,
    label: row.label,
    value: row.displayValue,
    minVisible: row.minVisible,
    publicVisible: row.publicVisible ? 'yes' : 'no',
    gate: row.gateNote,
    unit: row.unit,
  }));

  return (
    <VStack gap={5}>
      <VStack gap={2}>
        <Heading level={1} type="display-3">
          Traction (raw)
        </Heading>
        <Text type="body" color="secondary">
          Admin sees every metric from data/traction.json, including nulls and
          values below minVisible. Public `/` still hides gated widgets.
        </Text>
      </VStack>

      <Banner
        status="info"
        title={updatedAt ? `Config updatedAt: ${updatedAt}` : 'updatedAt: null'}
        description={sourceNote}
      />

      <Table
        data={table}
        idKey="id"
        density="compact"
        columns={[
          {key: 'label', header: 'Metric'},
          {key: 'value', header: 'Raw value'},
          {key: 'unit', header: 'Unit'},
          {key: 'minVisible', header: 'minVisible'},
          {key: 'publicVisible', header: 'Public?'},
          {key: 'gate', header: 'Gate note'},
        ]}
      />
    </VStack>
  );
}
