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
/** Paul LOCK UPDATE: Apache 2.0 supersedes prior MIT pointer. */
const LICENSE_URL = `${REPO_URL}/blob/main/LICENSE`;
const APACHE_URL = 'https://www.apache.org/licenses/LICENSE-2.0';
/** AG #57 MERGED LIVE @ 9b5bcd9 — DRAFT outline SoT until superseding AG docs amend lands. */
const OUTLINE_SOT_URL =
  'https://github.com/paulthorson/agentic-governance/blob/9b5bcd9/docs/legal/get-ag-terms-outline.md';
const OUTLINE_PR_URL =
  'https://github.com/paulthorson/agentic-governance/pull/57';

/**
 * Get AG clickwrap — Paul LOCK UPDATE:
 * Apache 2.0 · install of own free will / accept risk / as-is ·
 * no default telemetry · opt-in OK · no anon-improve trade · Delaware ·
 * Production ToS NOT until counsel. Stay DRAFT. Look HOLD — no #39.
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
          description="Production ToS NOT until a licensed attorney drafts operative language. This page is a stub — not legal advice, not enforceable counsel work."
        />

        <VStack gap={2}>
          <Text type="supporting" color="secondary">
            DRAFT · Paul LOCK · Apache 2.0 · no default telemetry
          </Text>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Install of your own free will. You accept the risk. Software is
            provided as-is. Download targets Apache 2.0–licensed AG — never this
            marketing site. No telemetry or anonymous-improve trade as the
            price of download.
          </Text>
        </VStack>

        <Banner
          status="info"
          title="Paul LOCK — Apache 2.0 + install clickwrap"
          description="License pointer is Apache 2.0 (supersedes prior MIT). Clickwrap: own free will · accept risk · as-is. No default telemetry (opt-in OK; UI default OFF). No anonymous-improve trade. Delaware governing-law intent. Outline SoT AG #57 @ 9b5bcd9 until superseding amend (bc-e4300373) lands."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>Install clickwrap (stub)</Heading>
            </HStack>
            <Text type="supporting" color="secondary">
              Intent placeholders only — counsel replaces before ship.
            </Text>
            <List>
              <ListItem label="I install Agentic Governance of my own free will." />
              <ListItem label="I accept the risk of use." />
              <ListItem label="Software and docs are provided as-is, without warranty." />
              <ListItem label="Product license pointer: Apache License 2.0 (see LICENSE on AG)." />
              <ListItem label="No default telemetry. Opt-in only OK; if any telemetry UI exists, it defaults OFF." />
              <ListItem label="No anonymous-improve trade and no telemetry-as-price-of-download." />
              <ListItem label="Governing law intent: Delaware (Paul LOCK) — no invented venue/city without Paul + counsel." />
              <ListItem label="Download / clone only at github.com/paulthorson/agentic-governance." />
            </List>

            <HStack gap={3} wrap="wrap">
              <Button
                label="Apache 2.0 LICENSE on AG"
                variant="secondary"
                href={LICENSE_URL}
              />
              <Button label="Apache 2.0 text" variant="ghost" href={APACHE_URL} />
              <Button
                label="DRAFT outline SoT (#57)"
                variant="ghost"
                href={OUTLINE_SOT_URL}
              />
              <Button label="AG PR #57" variant="ghost" href={OUTLINE_PR_URL} />
            </HStack>

            <CheckboxInput
              label="I install of my own free will, accept the risk, and agree these DRAFT as-is Terms to continue to Get AG"
              description="Paul LOCK: Apache 2.0 · own free will · accept risk · as-is. No default telemetry. Not an anonymous-improve or telemetry trade. Unchecked by default. Production ToS NOT until licensed attorney."
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
                Accept install clickwrap (free will · risk · as-is) before
                download.
              </Text>
            ) : null}
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
