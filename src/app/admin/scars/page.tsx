import {auth} from '@/auth';
import {AdminScarsView} from '@/components/AdminScars';
import {isAdminEmail} from '@/lib/admin-access';
import {loadScarIndex} from '@/lib/scars';
import {redirect} from 'next/navigation';

export default async function AdminScarsPage() {
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect('/admin/login');
  }

  const index = await loadScarIndex();
  return (
    <AdminScarsView entries={index.entries} sourceNote={index.sourceNote} />
  );
}
