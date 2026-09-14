'use client';

import {EmptyState} from '@astryxdesign/core/EmptyState';
import {List, ListItem} from '@astryxdesign/core/List';
import {Section} from '@astryxdesign/core/Section';
import {Table} from '@astryxdesign/core/Table';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import type {ImproveReport} from '@/lib/improve';

interface KpiRow extends Record<string, unknown> {
  name: string;
  value: string;
  source: string;
}

function toKpiRows(kpis: ImproveReport['kpis']): KpiRow[] {
  return kpis.map((kpi) => ({
    name: kpi.name,
    value: kpi.value || 'Baseline / unpaid',
    source: kpi.source || '—',
  }));
}

export function AdminReportsView({reports}: {reports: ImproveReport[]}) {
  if (reports.length === 0) {
    return (
      <EmptyState
        title="No improve reports"
        description="Add docs/improve/YYYY-MM-DD.md and redeploy."
      />
    );
  }

  return (
    <VStack gap={6}>
      <VStack gap={2}>
        <Heading level={1} type="display-3">
          Improve report detail
        </Heading>
        <Text type="body" color="secondary">
          Full internal view of daily reports. KPI cells keep their written
          values — baseline / unpaid when unmeasured. No invented numbers.
        </Text>
      </VStack>

      {reports.map((report) => (
        <Section key={report.date} padding={5} dividers={['bottom']}>
          <VStack gap={4}>
            <HStack gap={3} hAlign="between" vAlign="end" wrap="wrap">
              <Heading level={2}>{report.title}</Heading>
              <Text type="supporting" color="secondary">
                {report.date}
              </Text>
            </HStack>

            {report.improvements.length > 0 && (
              <List header={<Heading level={3}>Shipped</Heading>}>
                {report.improvements.map((item) => (
                  <ListItem key={item} label={item} />
                ))}
              </List>
            )}

            {report.gains.length > 0 && (
              <List header={<Heading level={3}>Gains</Heading>}>
                {report.gains.map((item) => (
                  <ListItem key={item} label={item} />
                ))}
              </List>
            )}

            <VStack gap={2}>
              <Heading level={3}>KPIs</Heading>
              {report.kpis.length === 0 ? (
                <Text type="supporting" color="secondary">
                  No KPI table in this report.
                </Text>
              ) : (
                <Table
                  data={toKpiRows(report.kpis)}
                  idKey="name"
                  density="compact"
                  columns={[
                    {key: 'name', header: 'KPI'},
                    {key: 'value', header: 'Value'},
                    {key: 'source', header: 'Source / method'},
                  ]}
                />
              )}
            </VStack>

            {report.limenFeedback.length > 0 && (
              <List header={<Heading level={3}>Limen / engine feedback</Heading>}>
                {report.limenFeedback.map((item) => (
                  <ListItem key={item} label={item} />
                ))}
              </List>
            )}

            {report.contributionInvites.length > 0 && (
              <List header={<Heading level={3}>Open invites</Heading>}>
                {report.contributionInvites.map((item) => (
                  <ListItem key={item} label={item} />
                ))}
              </List>
            )}

            {report.changelogLinks.length > 0 && (
              <List header={<Heading level={3}>Changelog links</Heading>}>
                {report.changelogLinks.map((item) => (
                  <ListItem key={item} label={item} />
                ))}
              </List>
            )}
          </VStack>
        </Section>
      ))}
    </VStack>
  );
}
