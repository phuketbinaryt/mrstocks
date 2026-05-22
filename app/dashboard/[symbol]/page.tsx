import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireActiveMembership } from '@/lib/membership/require';
import {
  getCandidatesForScan,
  getLatestScan,
} from '@/lib/scans/latest';
import { toDashboardCandidate } from '@/lib/scans/candidate-types';
import StateBadge from '@/components/dashboard/StateBadge';
import ZoneBand from '@/components/symbol/ZoneBand';
import DetailSection, { KV } from '@/components/symbol/DetailSection';
import TopBar from '@/components/dashboard/TopBar';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { symbol } = await params;
  return { title: `${symbol.toUpperCase()} — MR/STOCKS` };
}

export default async function SymbolDetailPage({ params }: PageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = decodeURIComponent(rawSymbol).toUpperCase();

  await requireActiveMembership(`/dashboard/${rawSymbol}`);

  const scan = await getLatestScan();
  const rows = scan ? await getCandidatesForScan(scan.id) : [];
  const match = rows.find((r) => r.symbol.toUpperCase() === symbol);

  if (!match || !scan) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col">
        <TopBar
          generatedAt={scan ? scan.generatedAt : new Date()}
          title="SYMBOL"
        />
        <div className="flex-1 grid place-items-center px-8">
          <div className="text-center max-w-[36ch]">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 mb-2">
              NOT IN TODAY&apos;S SCAN
            </div>
            <h2 className="text-[20px] text-white font-medium tracking-tight">
              {symbol} wasn&apos;t a candidate in the most recent 09:15 NY scan.
            </h2>
            <p className="text-[13px] text-white/75 mt-2">
              Symbol may not be in the eligible large-cap universe, or it
              failed the liquidity / SMA filters today.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-6 px-3.5 py-2 rounded-sm border border-white/22 bg-white/8 hover:bg-white/10 text-[12.5px] text-white"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const c = toDashboardCandidate(match);
  const gapPos = c.gap >= 0;
  const slopeTone =
    c.slopeFast >= 0
      ? 'text-[oklch(0.78_0.16_150)]'
      : 'text-[oklch(0.74_0.17_28)]';

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <header className="sticky top-0 z-10 bg-black/85 backdrop-blur-md border-b border-white/22">
        <div className="flex items-center gap-3 px-4 md:px-6 h-12 md:h-14">
          <Link
            href="/dashboard"
            aria-label="Back to dashboard"
            className="-ml-1 p-1.5 rounded text-white/75 hover:text-white hover:bg-white/8"
          >
            <ChevronLeft size={16} />
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-mono text-[15px] text-[oklch(0.86_0.14_75)] tracking-tight">
              {c.symbol}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-[12px] text-white/75 truncate">
              US large-cap
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Hero */}
        <div className="px-4 md:px-6 pt-5 md:pt-7 pb-6 md:pb-8 border-b border-white/18">
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StateBadge state={c.state} size="md" />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/65">
                SCORE
              </span>
              <span className="font-mono text-[13px] text-white tabular-nums">
                {Math.round(c.score)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/65 ml-1">
                PRIOR45
              </span>
              <span className="font-mono text-[12px] text-white tabular-nums">
                {c.prior45Position ?? '—'}
              </span>
            </div>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="font-mono text-[42px] md:text-[56px] leading-[0.95] tabular-nums tracking-tight text-white">
                ${c.lastPrice.toFixed(2)}
              </span>
              <span
                className={`font-mono text-[14px] md:text-[18px] tabular-nums ${
                  gapPos
                    ? 'text-[oklch(0.78_0.16_150)]'
                    : 'text-[oklch(0.74_0.17_28)]'
                }`}
              >
                {gapPos ? '+' : ''}
                {c.gap.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-white/70 flex-wrap">
              <span className="whitespace-nowrap">
                SCAN {scan.generatedAt.toISOString().slice(11, 16)} UTC
              </span>
              <span className="text-[oklch(0.82_0.16_75/0.5)]">│</span>
              <span className="whitespace-nowrap">
                AVG VOL{' '}
                <span className="text-[oklch(0.78_0.12_200)] tabular-nums">
                  ${formatVolume(c.avgDollarVolume)}
                </span>
              </span>
            </div>
          </div>
        </div>

        <DetailSection title="Moving averages" eyebrow="01">
          <KV
            rows={[
              {
                label: 'Distance · ATR',
                value: c.maDistanceAtr.toFixed(2),
              },
              {
                label: 'Distance · %',
                value: `${(c.maDistancePct * 100).toFixed(2)}%`,
              },
              {
                label: 'ATR (2m)',
                value: c.atr.toFixed(2),
              },
              {
                label: 'Slope · fast',
                value: `${c.slopeFast > 0 ? '+' : ''}${c.slopeFast.toFixed(2)}`,
                tone: slopeTone,
              },
            ]}
          />
        </DetailSection>

        <DetailSection title="Prior45 zone" eyebrow="02">
          <div className="flex flex-col gap-5">
            <KV
              columns={2}
              rows={[
                { label: 'Position', value: c.prior45Position ?? '—' },
                {
                  label: 'Action',
                  value: c.prior45Action ?? '—',
                },
              ]}
            />
            <ZoneBand state={c.state} position={c.prior45Position} />
          </div>
        </DetailSection>

        <DetailSection title="Liquidity" eyebrow="03">
          <KV
            columns={1}
            rows={[
              {
                label: 'Avg $ volume',
                value: `$${formatVolume(c.avgDollarVolume)}`,
              },
              { label: 'Last price', value: `$${c.lastPrice.toFixed(2)}` },
              {
                label: 'Score',
                value: `${Math.round(c.score)} / 100`,
              },
            ]}
          />
        </DetailSection>

        <DetailSection title="Scanner notes" eyebrow="04">
          <p className="text-[13px] leading-relaxed text-white/70">
            {c.watch
              ? `Watch: ${c.watch}.`
              : 'No additional scanner notes for this candidate.'}
          </p>
          <div className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[oklch(0.82_0.16_75)]">
            FLAGGED {scan.generatedAt.toISOString().slice(11, 19)} UTC · scanner
            v2.4
          </div>
        </DetailSection>
      </div>
    </main>
  );
}

function formatVolume(usd: number): string {
  if (!Number.isFinite(usd) || usd <= 0) return '—';
  if (usd >= 1_000_000_000) return `${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `${(usd / 1_000_000).toFixed(1)}M`;
  if (usd >= 1_000) return `${(usd / 1_000).toFixed(1)}K`;
  return usd.toFixed(0);
}
