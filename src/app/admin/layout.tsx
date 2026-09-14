import {auth} from '@/auth';
import {AdminChrome} from '@/components/AdminChrome';
import {isAdminEmail} from '@/lib/admin-access';
import {headers} from 'next/headers';

/**
 * Admin chrome for signed-in allowlisted users on ops routes.
 * Exact `/admin` is the twin Process Instrument face (F7) — no SideNav chrome.
 * /admin/login renders children only so Google SSO can complete.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const email = session?.user?.email ?? null;

  if (!email || !isAdminEmail(email)) {
    return <>{children}</>;
  }

  const headerList = await headers();
  if (headerList.get('x-ag-admin-twin') === '1') {
    return <>{children}</>;
  }

  return <AdminChrome email={email}>{children}</AdminChrome>;
}
