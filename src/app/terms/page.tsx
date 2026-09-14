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
const RELEASES_URL = `${REPO_URL}/releases`;
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
const APACHE_URL = 'https://www.apache.org/licenses/LICENSE-2.0';
/** AG #60 MERGED LIVE @ 86e98081 — Apache + Get AG Terms SoT (supersedes #57-only Apache cites). */
const OUTLINE_SOT_URL =
  'https://github.com/paulthorson/agentic-governance/blob/86e98081/docs/legal/get-ag-terms-outline.md';
const DRAFT_TERMS_URL =
  'https://github.com/paulthorson/agentic-governance/blob/86e98081/docs/legal/get-ag-terms-DRAFT.md';
const OUTLINE_PR_URL =
  'https://github.com/paulthorson/agentic-governance/pull/60';

/**
 * Get AG clickwrap stub — Adv CONCERN + Paul LOCK:
 * SoT AG #60 @ 86e98081 · Apache 2.0 · free will / as-is ·
 * contracting party BLANK until lawyer (no invented LLC / personal party) ·
 * no default telemetry · Delaware · name ungated Releases ·
 * re-gate secondary download deep-links. Stay DRAFT. Look HOLD.
 */
export default function TermsPage() {
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
          description="Production ToS NOT until a licensed attorney drafts operative language. Contracting party is blank until counsel — do not invent an LLC or personal party name here. Not legal advice."
        />

        <VStack gap={2}>
          <Text type="supporting" color="secondary">
            DRAFT · AG #60 @ 86e98081 · Apache 2.0 · no default telemetry
          </Text>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Install of your own free will. Software is as-is. Operator accepts
            risk. Contracting party: [blank — counsel unpaid]. Download after
            clickwrap targets the Apache 2.0 product repo — never this marketing
            site.
          </Text>
        </VStack>

        <Banner
          status="warning"
          title="Named ungated path: GitHub Releases"
          description={`${RELEASES_URL} (and release assets / source zips on that page) can bypass this site clickwrap today. Site CTAs must not deep-link there until gated. Clone/download via repo root after accept is the gated path.`}
        />

        <Banner
          status="info"
          title="SoT — AG #60 MERGED LIVE @ 86e98081"
          description="Apache 2.0 LICENSE + docs/legal/get-ag-terms-outline.md (and get-ag-terms-DRAFT.md). Supersedes older #57-only Apache cites. No default telemetry (opt-in OK). Delaware. Contracting party blank until lawyer."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>Install clickwrap (stub)</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Intent placeholders only — counsel replaces before ship.
              Contracting party intentionally blank.
            </Text>
            <List>
              <ListItem label="I install Agentic Governance of my own free will." />
              <ListItem label="Software and docs are provided as-is, without warranty." />
              <ListItem label="I accept the risk of use. Operator / end-user assumes responsibility." />
              <ListItem label="Contracting party: [blank — counsel unpaid]. Do not invent an LLC or personal party name." />
              <ListItem label="Product license pointer: Apache License 2.0 (not MIT) — see LICENSE on AG @ #60." />
              <ListItem label="No default telemetry. Opt-in only OK; if any telemetry UI exists, it defaults OFF." />
              <ListItem label="No anonymous-improve trade and no telemetry-as-price-of-download." />
              <ListItem label="Governing law intent: Delaware — no invented venue/city without counsel." />
              <ListItem label="Gated download after accept: github.com/paulthorson/agentic-governance (repo). Ungated today: …/releases (named; do not deep-link from site CTAs)." />
            </List>

            <HStack gap={3} wrap="wrap">
              <Button
                label="Apache 2.0 LICENSE on AG"
                variant="secondary"
                href={LICENSE_URL}
              />
              <Button label="Apache 2.0 text" variant="ghost" href={APACHE_URL} />
              <Button
                label="Outline SoT (#60)"
                variant="ghost"
                href={OUTLINE_SOT_URL}
              />
              <Button label="DRAFT tear-through" variant="ghost" href={DRAFT_TERMS_URL} />
              <Button label="AG PR #60" variant="ghost" href={OUTLINE_PR_URL} />
            </HStack>

            <CheckboxInput
              label="I install of my own free will, agree these DRAFT as-is Terms, and accept the risk (contracting party blank until counsel)"
              description="Apache 2.0 · own free will · as-is · risk accepted · party blank until lawyer. No default telemetry. Unchecked by default. Production ToS NOT until licensed attorney."
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
                Accept install clickwrap before download. Site does not link
                Releases until that path is gated.
              </Text>
            ) : null}
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
