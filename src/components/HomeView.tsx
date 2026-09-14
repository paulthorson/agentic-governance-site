'use client';

import {AppShell} from '@astryxdesign/core/AppShell';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Divider} from '@astryxdesign/core/Divider';
import {EmptyState} from '@astryxdesign/core/EmptyState';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {List, ListItem} from '@astryxdesign/core/List';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Section} from '@astryxdesign/core/Section';
import {Table} from '@astryxdesign/core/Table';
import {Heading, Text} from '@astryxdesign/core/Text';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  ScaleIcon,
} from '@heroicons/react/20/solid';
import {CubeIcon} from '@heroicons/react/24/outline';
import {ImproveCharts, KpiStrip} from '@/components/KpiPanel';
import {TractionGate} from '@/components/TractionStrip';
import type {ImproveKpi, ImproveReport} from '@/lib/improve';
import type {AggregatedKpi, ChartPoint} from '@/lib/kpis';
import type {TractionMetric} from '@/lib/traction';

const REPO_URL = 'https://github.com/paulthorson/agentic-governance';
const TERMS_URL = '/terms';
const CHANGELOG_URL = `${REPO_URL}/blob/main/CHANGELOG.md`;
const CONTRIBUTE_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
const IMPROVE_DOCS_URL = `${REPO_URL}/tree/main/docs/improve`;
const README_URL = `${REPO_URL}#quick-start-any-system`;

interface KpiRow extends Record<string, unknown> {
  name: string;
  value: string;
  source: string;
}

function toKpiRows(kpis: ImproveKpi[]): KpiRow[] {
  return kpis.map((kpi) => ({
    name: kpi.name,
    value: kpi.value,
    source: kpi.source,
  }));
}

function ReportSection({report}: {report: ImproveReport}) {
  return (
    <Section padding={5} dividers={['bottom']}>
      <VStack gap={4}>
        <HStack gap={3} hAlign="between" vAlign="end" wrap="wrap">
          <Heading level={3}>{report.title}</Heading>
          <Text type="supporting" color="secondary">
            {report.date}
          </Text>
        </HStack>

        {report.improvements.length > 0 && (
          <List header={<Heading level={4}>Shipped</Heading>}>
            {report.improvements.map((item) => (
              <ListItem key={item} label={item} />
            ))}
          </List>
        )}

        {report.gains.length > 0 && (
          <List header={<Heading level={4}>Gains</Heading>}>
            {report.gains.map((item) => (
              <ListItem key={item} label={item} />
            ))}
          </List>
        )}

        {report.kpis.length > 0 && (
          <VStack gap={2}>
            <Heading level={4}>KPIs</Heading>
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
          </VStack>
        )}

        {report.contributionInvites.length > 0 && (
          <List header={<Heading level={4}>Open invites</Heading>}>
            {report.contributionInvites.map((item) => (
              <ListItem key={item} label={item} />
            ))}
          </List>
        )}
      </VStack>
    </Section>
  );
}

export type HomeViewProps = {
  reports: ImproveReport[];
  kpis: AggregatedKpi[];
  series: ChartPoint[];
  hasMeasured: boolean;
  visibleTraction: TractionMetric[];
  gatedCount: number;
};

export function HomeView({
  reports,
  kpis,
  series,
  hasMeasured,
  visibleTraction,
  gatedCount,
}: HomeViewProps) {
  return (
    <AppShell
      height="auto"
      contentPadding={6}
      variant="section"
      topNav={
        <TopNav
          label="Primary"
          heading={
            <TopNavHeading
              heading="Agentic Governance"
              headingHref="/"
              logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
            />
          }
          startContent={
            <>
              <TopNavItem label="KPIs" href="#kpis" isSelected />
              <TopNavItem label="Get AG" href={TERMS_URL} />
              <TopNavItem label="Changelog" href="#changelog" />
              <TopNavItem label="Contribute" href="#contribute" />
            </>
          }
          endContent={
            <Button
              label="Get Agentic Governance"
              variant="primary"
              size="sm"
              href={TERMS_URL}
              icon={<Icon icon={ArrowDownTrayIcon} size="sm" color="inherit" />}
            />
          }
        />
      }
    >
      <VStack gap={8} maxWidth={1080}>
        <VStack gap={4} id="kpis">
          <VStack gap={2}>
            <Heading level={1} type="display-3" textWrap="balance">
              Continuous improve, measured honestly
            </Heading>
            <Text type="body" color="secondary" textWrap="balance">
              KPI strip and charts pull improve / traction feeds read-only from
              the AG product repo. Baseline and empty states are intentional —
              numbers are never invented.
            </Text>
          </VStack>

          <KpiStrip kpis={kpis} />
          <ImproveCharts series={series} hasMeasured={hasMeasured} />
        </VStack>

        <TractionGate visible={visibleTraction} hiddenCount={gatedCount} />

        <Card padding={6} elevation="med" id="get-ag">
          <VStack gap={4} hAlign="start">
            <Heading level={2} type="display-3" textWrap="balance">
              Get Agentic Governance
            </Heading>
            <Text type="body" color="secondary" textWrap="balance">
              Clone the framework, run the MCP server, and adopt with the setup
              wizard. Download always targets the product repo on GitHub — never
              this marketing site. Get AG passes through Terms first.
            </Text>
            <HStack gap={3} wrap="wrap">
              <Button
                label="Get AG (via Terms)"
                variant="primary"
                size="lg"
                href={TERMS_URL}
                icon={
                  <Icon icon={ArrowDownTrayIcon} size="sm" color="inherit" />
                }
                endContent={
                  <Icon icon={ArrowRightIcon} size="sm" color="inherit" />
                }
              />
              <Button
                label="Quick start"
                variant="secondary"
                size="lg"
                href={README_URL}
              />
            </HStack>
            <Text type="supporting" color="secondary">
              Get AG CTA pixels HOLD. Clickwrap on /terms = as-is Terms accept
              only (Cos LOCK: MIT-only / no default telemetry). DRAFT — lawyer
              review required. Look HOLD #39.
            </Text>
          </VStack>
        </Card>

        <Divider />

        <VStack gap={3}>
          <Heading level={2}>What Agentic Governance is</Heading>
          <Text type="body" color="secondary">
            A bring-your-own-agent governance framework: workers produce work,
            adversaries judge it blind, a constitution gates hard vetoes, and
            only a human clears a veto. Same loop via MCP for any capable
            client.
          </Text>
        </VStack>

        <VStack gap={3} id="reports">
          <Heading level={2}>Daily improve reports</Heading>
          <Text type="body" color="secondary">
            Source of truth for the KPI strip above.
          </Text>
          {reports.length === 0 ? (
            <EmptyState
              title="No improve reports in the AG feed yet"
              description="Improve corpus stays on AG. When dated docs/improve/*.md (or data/improve.json) are published there, this surface pulls them read-only."
              actions={
                <Button
                  label="Open docs/improve on AG"
                  variant="secondary"
                  href={IMPROVE_DOCS_URL}
                />
              }
            />
          ) : (
            <VStack gap={0}>
              {reports.map((report) => (
                <ReportSection key={report.date} report={report} />
              ))}
            </VStack>
          )}
        </VStack>

        <VStack gap={3} id="changelog">
          <Heading level={2}>Changelog</Heading>
          <Card elevation="low" padding={5} maxWidth={640}>
            <VStack gap={3} hAlign="start">
              <HStack gap={2} vAlign="center">
                <Icon icon={DocumentTextIcon} size="md" />
                <Heading level={3}>Keep a Changelog, Unreleased first</Heading>
              </HStack>
              <HStack gap={3} wrap="wrap">
                <Button
                  label="Read CHANGELOG.md"
                  variant="primary"
                  href={CHANGELOG_URL}
                />
                <Button label="Open the repo" variant="secondary" href={REPO_URL} />
              </HStack>
            </VStack>
          </Card>
        </VStack>

        <VStack gap={3} id="contribute">
          <Heading level={2}>Contribute</Heading>
          <Card elevation="low" padding={5} maxWidth={640}>
            <VStack gap={3} hAlign="start">
              <HStack gap={2} vAlign="center">
                <Icon icon={ScaleIcon} size="md" />
                <Heading level={3}>Help harden the improve path</Heading>
              </HStack>
              <Text type="body" color="secondary">
                Template review, real KPI source wiring, and clearer CTAs.
                Traction widgets are already coded — Cos raises thresholds in
                data/traction.json when numbers are measured.
              </Text>
              <HStack gap={3} wrap="wrap">
                <Button
                  label="Contributing guide"
                  variant="primary"
                  href={CONTRIBUTE_URL}
                />
                <Button
                  label="docs/improve"
                  variant="secondary"
                  href={IMPROVE_DOCS_URL}
                />
              </HStack>
            </VStack>
          </Card>
        </VStack>

        <Text type="supporting" color="secondary">
          UI source of truth: Meta Astryx (@astryxdesign/core + theme-neutral).
          Feeds pull read-only from AG (docs/improve + data/traction.json).{' '}
          {gatedCount} traction metrics hidden at current thresholds.
        </Text>
      </VStack>
    </AppShell>
  );
}
