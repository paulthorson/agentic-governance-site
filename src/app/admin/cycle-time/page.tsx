import {auth} from '@/auth';
import {AdminCycleTimeView} from '@/components/AdminCycleTime';
import {isAdminEmail} from '@/lib/admin-access';
import {loadImproveReports} from '@/lib/improve';
import {redirect} from 'next/navigation';

export default async function AdminCycleTimePage() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/admin/login');
  }

  return <AdminCycleTimeView reports={await loadImproveReports()} />;
}
