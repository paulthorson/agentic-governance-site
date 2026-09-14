'use client';

import {AppShell} from '@astryxdesign/core/AppShell';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import {HStack, VStack} from '@astryxdesign/core/Layout';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {Text} from '@astryxdesign/core/Text';
import {TopNav, TopNavHeading, TopNavItem} from '@astryxdesign/core/TopNav';
import {
  ArrowRightStartOnRectangleIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import {CubeIcon} from '@heroicons/react/24/outline';
import {usePathname} from 'next/navigation';
import type {ReactNode} from 'react';
import {signOutAdmin} from '@/app/admin/actions';

export type AdminChromeProps = {
  email: string;
  children: ReactNode;
};

export function AdminChrome({email, children}: AdminChromeProps) {
  const pathname = usePathname();

  return (
    <AppShell
      height="auto"
      contentPadding={6}
      variant="section"
      topNav={
        <TopNav
          label="Admin"
          heading={
            <TopNavHeading
              heading="AG Admin"
              headingHref="/admin"
              logo={<NavIcon icon={<Icon icon={CubeIcon} size="sm" />} />}
            />
          }
          startContent={
            <>
              <TopNavItem
                label="Overview"
                href="/admin"
                isSelected={pathname === '/admin'}
              />
              <TopNavItem
                label="Reports"
                href="/admin/reports"
                isSelected={pathname.startsWith('/admin/reports')}
              />
              <TopNavItem
                label="Traction"
                href="/admin/traction"
                isSelected={pathname.startsWith('/admin/traction')}
              />
              <TopNavItem label="Public site" href="/" />
            </>
          }
          endContent={
            <HStack gap={3} vAlign="center">
              <Text type="supporting" color="secondary">
                {email}
              </Text>
              <form action={signOutAdmin}>
                <Button
                  type="submit"
                  label="Sign out"
                  variant="ghost"
                  size="sm"
                  icon={
                    <Icon
                      icon={ArrowRightStartOnRectangleIcon}
                      size="sm"
                      color="inherit"
                    />
                  }
                />
              </form>
            </HStack>
          }
        />
      }
      sideNav={
        <SideNav
          collapsible
          header={
            <SideNavHeading
              heading="Internal"
              icon={<Icon icon={CubeIcon} size="sm" />}
            />
          }
        >
          <SideNavSection title="KPIs">
            <SideNavItem
              label="Overview"
              href="/admin"
              isSelected={pathname === '/admin'}
              icon={HomeIcon}
            />
            <SideNavItem
              label="Token usage"
              href="/admin/tokens"
              isSelected={pathname.startsWith('/admin/tokens')}
              icon={SparklesIcon}
            />
            <SideNavItem
              label="Cycle time"
              href="/admin/cycle-time"
              isSelected={pathname.startsWith('/admin/cycle-time')}
              icon={ClockIcon}
            />
            <SideNavItem
              label="Scar index"
              href="/admin/scars"
              isSelected={pathname.startsWith('/admin/scars')}
              icon={ExclamationTriangleIcon}
            />
          </SideNavSection>
          <SideNavSection title="Feeds">
            <SideNavItem
              label="Improve reports"
              href="/admin/reports"
              isSelected={pathname.startsWith('/admin/reports')}
              icon={DocumentTextIcon}
            />
            <SideNavItem
              label="Traction raw"
              href="/admin/traction"
              isSelected={pathname.startsWith('/admin/traction')}
              icon={ChartBarIcon}
            />
          </SideNavSection>
        </SideNav>
      }
    >
      <VStack gap={6} maxWidth={1080}>
        {children}
      </VStack>
    </AppShell>
  );
}
