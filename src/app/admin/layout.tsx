import {auth} from '@/auth';
import {AdminChrome} from '@/components/AdminChrome';
import {isAdminEmail} from '@/lib/admin-access';

/**
 * Admin chrome for signed-in allowlisted users.
 * /admin/login renders children only (no chrome) so Google SSO can complete.
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

  return <AdminChrome email={email}>{children}</AdminChrome>;
}
