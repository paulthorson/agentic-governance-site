import {AppShell} from '@astryxdesign/core/AppShell';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {VStack} from '@astryxdesign/core/Layout';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {Heading, Text} from '@astryxdesign/core/Text';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {CubeIcon} from '@heroicons/react/24/outline';

const REPO_URL = 'https://github.com/paulthorson/agentic-governance';

/**
 * Terms of use pending — acceptance gate TAKEN DOWN.
 * No checkbox, no accept, no recording, no gated Continue.
 * Prior clickwrap / DRAFT terms copy remains in docs/terms.md for review only
 * (not rendered as a live agreement).
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
            Terms of use: pending.
          </Heading>
          <Text type="body" color="secondary" textWrap="balance">
            No acceptance is required. Get AG is available on GitHub without a
            site clickwrap.
          </Text>
        </VStack>
        <Button
          label="Get AG on GitHub"
          variant="primary"
          size="lg"
          href={REPO_URL}
        />
        <Button label="Back to site" variant="secondary" href="/" />
      </VStack>
    </AppShell>
  );
}
