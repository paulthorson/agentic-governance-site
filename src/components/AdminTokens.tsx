'use client';

import {Banner} from '@astryxdesign/core/Banner';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Table} from '@astryxdesign/core/Table';
import {VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {ImproveReport} from '@/lib/improve';

interface TokenRow extends Record<string, unknown> {
  date: string;
  tokens: string;
  money: string;
  source: string;
}

function rowsFromReports(reports: ImproveReport[]): TokenRow[] {
  return reports.map((report) => {
    const kpi = report.kpis.find((k) =>
      k.name.toLowerCase().startsWith('token'),
    );
    const money = report.kpis.find((k) =>
      k.name.toLowerCase().includes('money'),
    );
    const raw = kpi?.value?.trim() || '';
    const isBaseline =
      !kpi ||
      raw.length === 0 ||
      /not measured|baseline|^—$|^-$/i.test(raw);
    return {
      date: report.date,
      tokens: isBaseline ? 'Baseline / unpaid' : raw,
      money:
        money?.value && money.value !== '—'
          ? money.value
          : 'unpaid / not attributed',
      source: kpi?.source || 'no token feed wired yet',
    };
  });
}

export function AdminTokensView({reports}: {reports: ImproveReport[]}) {
  const rows = rowsFromReports(reports);

  return (
    <VStack gap={5}>
      <VStack gap={2}>
        <Heading level={1} type="display-3">
          Token usage
        </Heading>
        <Text type="body" color="secondary">
          Placeholders only until a measured provider bill or engine log is
          wired into docs/improve. Never invent live token or $ numbers.
        </Text>
      </VStack>

      <Banner
        status="warning"
        title="Unpaid / baseline"
        description="Until Cos/Paul attach a real token feed, every cell stays Baseline / unpaid. Admin may see that honesty; public marketing never fabricates a series."
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No improve reports"
          description="Token placeholders appear once dated reports exist."
        />
      ) : (
        <Table
          data={rows}
          idKey="date"
          density="compact"
          columns={[
            {key: 'date', header: 'Date'},
            {key: 'tokens', header: 'Tokens'},
            {key: 'money', header: 'Money'},
            {key: 'source', header: 'Source / method'},
          ]}
        />
      )}
    </VStack>
  );
}
