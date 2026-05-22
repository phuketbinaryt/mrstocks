import { requireActiveMembership } from '@/lib/membership/require';
import {
  getCandidatesForScan,
  getLatestScan,
} from '@/lib/scans/latest';
import { toDashboardCandidate } from '@/lib/scans/candidate-types';
import DashboardClient from './client';
import EmptyState from '@/components/dashboard/EmptyState';
import TopBar from '@/components/dashboard/TopBar';

export const metadata = {
  title: 'Dashboard — MR/STOCKS',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  await requireActiveMembership('/dashboard');

  const scan = await getLatestScan();
  if (!scan) {
    return (
      <main className="min-h-screen flex flex-col bg-black text-white">
        <TopBar generatedAt={new Date()} />
        <div className="flex-1">
          <EmptyState variant="no-scan-yet" />
        </div>
      </main>
    );
  }

  const rows = await getCandidatesForScan(scan.id);
  const candidates = rows.map(toDashboardCandidate);

  return (
    <DashboardClient
      generatedAtISO={scan.generatedAt.toISOString()}
      universeSize={scan.universeSize ?? null}
      barSeconds={scan.barSeconds ?? null}
      candidates={candidates}
    />
  );
}
