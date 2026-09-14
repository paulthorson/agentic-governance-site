import {auth} from '@/auth';
import {AdminReportsView} from '@/components/AdminReports';
import {isAdminEmail} from '@/lib/admin-access';
import {loadImproveReports} from '@/lib/improve';
import {redirect} from 'next/navigation';

export default async function AdminReportsPage() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/admin/login');
  }

  return <AdminReportsView reports={await loadImproveReports()} />;
}
