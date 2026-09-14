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

/**
 * Stub T&Cs gate for Get AG.
 * Paul LOCK: clickwrap required before download; counsel required before ship.
 * Outline tip in flight elsewhere (bc-47307f02) — this page stays stub/DRAFT only.
 * Look pixels HOLD — no #39 redesign.
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
          description="Never ship ToS without counsel. This page is a stub/outline only (Get AG ToS outline tip in flight elsewhere). Not legal advice."
        />

        <VStack gap={2}>
          <Text type="supporting" color="secondary">
            DRAFT · stub / outline · not counsel-approved
          </Text>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Get Agentic Governance requires clickwrap acceptance on this path
            before download. The download target is always the product repo —
            never this marketing site.
          </Text>
        </VStack>

        <Banner
          status="info"
          title="Lawyer review banner (required)"
          description="Liability language, anonymous-improve consent basics, and final ToS wording need counsel review before public launch. Do not treat this stub as shipped terms."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>Stub terms outline (not legal advice)</Heading>
            </HStack>
            <List>
              <ListItem label="AG is provided as-is; no warranty of fitness for a particular purpose." />
              <ListItem label="You are responsible for how you run agents, tools, and automation against your systems." />
              <ListItem label="Do not submit secrets, PII, or proprietary Studio material into public improve / feedback surfaces." />
              <ListItem label="Anonymous improve feedback, when enabled, must stay non-identifying and measured-honest." />
              <ListItem label="Product download / clone lives only at github.com/paulthorson/agentic-governance." />
            </List>

            <CheckboxInput
              label="I have read this DRAFT stub and agree to continue to Get AG"
              description="Paul LOCK: clickwrap required before download. Final terms replace this stub after lawyer review."
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
                Accept the clickwrap checkbox before download.
              </Text>
            ) : null}
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
