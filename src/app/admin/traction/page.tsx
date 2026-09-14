import {auth} from '@/auth';
import {AdminTractionView} from '@/components/AdminTraction';
import {isAdminEmail} from '@/lib/admin-access';
import {allTractionAdminRows, loadTractionConfig} from '@/lib/traction';
import {redirect} from 'next/navigation';

export default async function AdminTractionPage() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/admin/login');
  }

  const config = await loadTractionConfig();
  return (
    <AdminTractionView
      rows={allTractionAdminRows(config)}
      sourceNote={config.sourceNote}
      updatedAt={config.updatedAt}
    />
  );
}
