import {ProcessInstrumentView} from '@/components/process-instrument/ProcessInstrumentView';
import {loadImproveReports} from '@/lib/improve';
import {aggregateKpis} from '@/lib/kpis';

export default async function HomePage() {
  const reports = await loadImproveReports();
  const kpis = aggregateKpis(reports);
  const agPrs = kpis.find((k) => k.kind === 'agPrs');
  const measuredShipsThisWeek =
    agPrs?.status === 'measured' && agPrs.numericValue != null
      ? agPrs.numericValue
      : 0;

  return (
    <ProcessInstrumentView
      showGetAg
      measuredShipsThisWeek={measuredShipsThisWeek}
    />
  );
}
