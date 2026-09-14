import {auth} from '@/auth';
import {AdminOverviewView} from '@/components/AdminOverview';
import {isAdminEmail} from '@/lib/admin-access';
import {loadImproveReports} from '@/lib/improve';
import {
  aggregateKpis,
  buildKpiChartSeries,
  hasAnyMeasuredChartPoint,
} from '@/lib/kpis';
import {loadScarIndex} from '@/lib/scars';
import {allTractionAdminRows, loadTractionConfig} from '@/lib/traction';
import {redirect} from 'next/navigation';

export default async function AdminHomePage() {
  const session = await auth();
  const email = session?.user?.email ?? null;
  if (!email || !isAdminEmail(email)) {
    redirect('/admin/login');
  }

  const reports = await loadImproveReports();
  const kpis = aggregateKpis(reports);
  const series = buildKpiChartSeries(reports);
  const hasMeasured = hasAnyMeasuredChartPoint(series);
  const traction = await loadTractionConfig();
  const tractionRows = allTractionAdminRows(traction);
  const scars = await loadScarIndex();

  return (
    <AdminOverviewView
      email={email}
      kpis={kpis}
      series={series}
      hasMeasured={hasMeasured}
      reports={reports}
      tractionRows={tractionRows}
      scars={scars.entries}
      scarNote={scars.sourceNote}
    />
  );
}
