'use client';

import {useState} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {CheckboxInput} from '@astryxdesign/core/CheckboxInput';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {List, ListItem} from '@astryxdesign/core/List';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Heading, Text} from '@astryxdesign/core/Text';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {
  ArrowDownTrayIcon,
  ArrowRightIcon,
  ScaleIcon,
} from '@heroicons/react/20/solid';
import {CubeIcon} from '@heroicons/react/24/outline';

const REPO_URL = 'https://github.com/paulthorson/agentic-governance';
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
/** AG #57 MERGED LIVE @ 9b5bcd9 — DRAFT outline SoT until superseding AG docs amend lands. */
const OUTLINE_SOT_URL =
  'https://github.com/paulthorson/agentic-governance/blob/9b5bcd9/docs/legal/get-ag-terms-outline.md';
const OUTLINE_PR_URL =
  'https://github.com/paulthorson/agentic-governance/pull/57';

/**
 * Get AG clickwrap stub — Cos LOCK Paul: MIT-only / no default telemetry.
 * Clickwrap = as-is Terms accept only (NOT anonymous-improve / telemetry trade).
 * Outline SoT: AG #57 @ 9b5bcd9 until superseding amend tip (bc-e4300373) lands.
 * Production ToS NOT until licensed attorney. Stay DRAFT. Look HOLD — no #39.
 */
export default function TermsPage() {
  // Unchecked by default; never pre-check (FAIL browsewrap / dark pattern).
  const [accepted, setAccepted] = useState(false);

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
              <TopNavItem label="Home" href="/" />
              <TopNavItem label="Terms" href="/terms" isSelected />
            </>
          }
        />
      }
    >
      <VStack gap={6} maxWidth={720}>
        <Banner
          status="warning"
          title="DRAFT — lawyer review required before ship"
          description="Production ToS NOT until a licensed attorney drafts operative language. This page is a stub — not legal advice, not enforceable counsel work."
        />

        <VStack gap={2}>
          <Text type="supporting" color="secondary">
            DRAFT stub · Cos LOCK MIT-only · no default telemetry
          </Text>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Clickwrap here is as-is Terms accept only — not a data trade.
            Download targets the MIT-licensed product repo only — never this
            marketing site.
          </Text>
        </VStack>

        <Banner
          status="info"
          title="Cos LOCK — MIT-only / no default telemetry"
          description="Get AG download does not require anonymous-improve, telemetry, or any data-as-price. Acceptance is Terms (as-is) only. AG docs amend tip in flight (bc-e4300373); until it lands, cite AG #57 DRAFT outline SoT."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>As-is Terms accept (stub)</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Intent placeholders only — counsel replaces before ship.
            </Text>
            <List>
              <ListItem label="Clickwrap = as-is Terms accept only (FAIL browsewrap). Not an anonymous-improve or telemetry trade." />
              <ListItem label="MIT-only product license — no default telemetry on Get AG." />
              <ListItem label="MIT license on the product repo is authoritative for code licensing." />
              <ListItem label="As-is / no warranty; operator assumes use risk — liability language by counsel." />
              <ListItem label="Governing law intent: Delaware (Paul LOCK) — do not invent venue/city beyond that without Paul + counsel." />
              <ListItem label="Download / clone only at github.com/paulthorson/agentic-governance — never this site repo." />
            </List>

            <HStack gap={3} wrap="wrap">
              <Button label="MIT LICENSE on AG" variant="secondary" href={LICENSE_URL} />
              <Button
                label="DRAFT outline SoT (#57)"
                variant="ghost"
                href={OUTLINE_SOT_URL}
              />
              <Button label="AG PR #57" variant="ghost" href={OUTLINE_PR_URL} />
            </HStack>

            <CheckboxInput
              label="I accept these DRAFT as-is Terms to continue to Get AG"
              description="Cos LOCK: MIT-only / no default telemetry. Clickwrap is Terms accept only — not a telemetry or anonymous-improve trade. Unchecked by default. Production ToS NOT until licensed attorney."
              value={accepted}
              isRequired
              onChange={(checked) => setAccepted(checked)}
              width="100%"
            />

            <HStack gap={3} wrap="wrap">
              <Button
                label="Continue to Get AG on GitHub"
                variant="primary"
                size="lg"
                href={accepted ? REPO_URL : undefined}
                isDisabled={!accepted}
                icon={
                  <Icon icon={ArrowDownTrayIcon} size="sm" color="inherit" />
                }
                endContent={
                  <Icon icon={ArrowRightIcon} size="sm" color="inherit" />
                }
              />
              <Button label="Back to site" variant="secondary" size="lg" href="/" />
            </HStack>
            {!accepted ? (
              <Text type="supporting" color="secondary">
                Accept as-is Terms (clickwrap) before download — not a data
                trade.
              </Text>
            ) : null}
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
