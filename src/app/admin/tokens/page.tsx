import {auth} from '@/auth';
import {AdminTokensView} from '@/components/AdminTokens';
import {isAdminEmail} from '@/lib/admin-access';
import {loadImproveReports} from '@/lib/improve';
import {redirect} from 'next/navigation';

export default async function AdminTokensPage() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/admin/login');
  }

  return <AdminTokensView reports={await loadImproveReports()} />;
}
