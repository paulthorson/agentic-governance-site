'use client';

import {AppShell} from '@astryxdesign/core/AppShell';
import {Banner} from '@astryxdesign/core/Banner';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
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
 * Paul LOCK: download must pass through T&Cs (liability + anonymous basics).
 * Lawyer review required before ship — this page is not legal counsel.
 */
export default function TermsPage() {
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
        <VStack gap={3}>
          <Heading level={1} type="display-3" textWrap="balance">
            Terms before Get AG
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            Get Agentic Governance is gated through this terms path. The
            download target is always the product repo — never this marketing
            site.
          </Text>
        </VStack>

        <Banner
          status="warning"
          title="Lawyer review before ship"
          description="This is a stub gate only. Liability language, anonymous-improve consent basics, and final wording need counsel review before public launch."
        />

        <Card padding={6} elevation="med">
          <VStack gap={4} hAlign="start">
            <HStack gap={2} vAlign="center">
              <Icon icon={ScaleIcon} size="md" />
              <Heading level={2}>Stub terms (not legal advice)</Heading>
            </HStack>
            <List>
              <ListItem label="AG is provided as-is; no warranty of fitness for a particular purpose." />
              <ListItem label="You are responsible for how you run agents, tools, and automation against your systems." />
              <ListItem label="Do not submit secrets, PII, or proprietary Studio material into public improve / feedback surfaces." />
              <ListItem label="Anonymous improve feedback, when enabled, must stay non-identifying and measured-honest." />
              <ListItem label="Product download / clone lives only at github.com/paulthorson/agentic-governance." />
            </List>
            <Text type="supporting" color="secondary">
              Continuing acknowledges you read this stub and that final terms
              will replace it after lawyer review.
            </Text>
            <HStack gap={3} wrap="wrap">
              <Button
                label="Continue to Get AG on GitHub"
                variant="primary"
                size="lg"
                href={REPO_URL}
                icon={
                  <Icon icon={ArrowDownTrayIcon} size="sm" color="inherit" />
                }
                endContent={
                  <Icon icon={ArrowRightIcon} size="sm" color="inherit" />
                }
              />
              <Button label="Back to site" variant="secondary" size="lg" href="/" />
            </HStack>
          </VStack>
        </Card>
      </VStack>
    </AppShell>
  );
}
