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
/** AG #57 MERGED LIVE @ 9b5bcd9 — DRAFT outline SoT only (not production ToS). */
const OUTLINE_SOT_URL =
  'https://github.com/paulthorson/agentic-governance/blob/9b5bcd9/docs/legal/get-ag-terms-outline.md';
const OUTLINE_PR_URL =
  'https://github.com/paulthorson/agentic-governance/pull/57';

/**
 * Site T&Cs stub for Get AG — cites AG DRAFT outline SoT only.
 * SoT: docs/legal/get-ag-terms-outline.md — AG #57 MERGED LIVE @ 9b5bcd9
 * Production ToS NOT until licensed attorney.
 * Paul LOCK: clickwrap required (FAIL browsewrap). Get AG CTA pixels HOLD.
 * Look pixels HOLD — no #39 redesign.
 */
export default function TermsPage() {
  // Outline §2: unchecked-by-default; never pre-check.
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
          description="Production ToS NOT until a licensed attorney drafts operative language. This page is a stub citing the AG outline SoT only — not legal advice, not enforceable counsel work."
        />

        <VStack gap={2}>
          <Text type="supporting" color="secondary">
            DRAFT stub · cites AG #57 @ 9b5bcd9 · not counsel-approved
          </Text>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Get AG requires clickwrap acceptance before download (FAIL
            browsewrap). Download targets the product repo only — never this
            marketing site.
          </Text>
        </VStack>

        <Banner
          status="info"
          title="Outline SoT (AG #57 MERGED LIVE @ 9b5bcd9)"
          description="Product intent lives in docs/legal/get-ag-terms-outline.md on agentic-governance. Site stub must cite that outline — never invent production ToS here."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>Stub summary (outline intent only)</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Plain-English placeholders from the AG outline — counsel replaces
              these before ship. Governing law intent: Delaware (Paul LOCK).
            </Text>
            <List>
              <ListItem label="Acceptance: Get AG / download requires affirmative clickwrap; browsing alone is not acceptance (§1–2)." />
              <ListItem label="Free AG + anonymous improve basics default on; richer diagnostics opt-in; never secrets/PII/host paths (§3)." />
              <ListItem label="As-is / no warranty; operator assumes use risk — liability language by counsel (§4)." />
              <ListItem label="AG IP stays with AG; code license on the product repo remains authoritative once counsel aligns (§5)." />
              <ListItem label="Governing law intent: Delaware — do not invent venue/city beyond that without Paul + counsel (§7)." />
              <ListItem label="Download / clone only at github.com/paulthorson/agentic-governance — never this site repo." />
            </List>

            <HStack gap={3} wrap="wrap">
              <Button
                label="Open DRAFT outline SoT on AG"
                variant="secondary"
                href={OUTLINE_SOT_URL}
              />
              <Button label="AG PR #57" variant="ghost" href={OUTLINE_PR_URL} />
            </HStack>

            <CheckboxInput
              label="I have read this DRAFT stub (citing AG outline #57 @ 9b5bcd9) and agree to continue to Get AG"
              description="Paul LOCK: clickwrap required before download. Unchecked by default. Production ToS NOT until licensed attorney."
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
                Accept the clickwrap checkbox before download (browsewrap FAIL).
              </Text>
            ) : null}
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
