import {auth} from '@/auth';
import {ProcessInstrumentView} from '@/components/process-instrument/ProcessInstrumentView';
import {isAdminEmail} from '@/lib/admin-access';
import {loadImproveReports} from '@/lib/improve';
import {aggregateKpis} from '@/lib/kpis';
import {redirect} from 'next/navigation';

/**
 * Admin twin face (F7): same Process Instrument craft as public `/`.
 * No Get AG. Ops routes remain under /admin/* with AdminChrome.
 */
export default async function AdminHomePage() {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email || !isAdminEmail(email)) {
    redirect('/admin/login');
  }

  const reports = await loadImproveReports();
  const kpis = aggregateKpis(reports);
  const agPrs = kpis.find((k) => k.kind === 'agPrs');
  const measuredShipsThisWeek =
    agPrs?.status === 'measured' && agPrs.numericValue != null
      ? agPrs.numericValue
      : 0;

  return (
    <ProcessInstrumentView
      showGetAg={false}
      measuredShipsThisWeek={measuredShipsThisWeek}
    />
  );
}
