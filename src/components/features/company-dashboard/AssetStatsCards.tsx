import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';
import type { AssetStats } from '@/src/types';

interface AssetStatsCardsProps {
  stats: AssetStats;
}

const AssetIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

const SoldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ScrapedIcon = () => (
  <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="15" x2="15" y2="15" /><line x1="9" y1="18" x2="12" y2="18" />
    <line x1="10" y1="11" x2="14" y2="15" /><line x1="14" y1="11" x2="10" y2="15" />
  </svg>
);

const CARDS = [
  { label: 'Asset',         key: 'total'   as keyof AssetStats, bg: 'bg-[#E8F5E9]', icon: <AssetIcon />,   href: ROUTES.COMPANY_DASHBOARD_ASSETS },
  { label: 'Sold Asset',    key: 'sold'    as keyof AssetStats, bg: 'bg-[#E3F2FD]', icon: <SoldIcon />,    href: `${ROUTES.COMPANY_DASHBOARD_ASSET_DECOMMISSION}/sale` },
  { label: 'Scraped Asset', key: 'scraped' as keyof AssetStats, bg: 'bg-[#FFEBEE]', icon: <ScrapedIcon />, href: `${ROUTES.COMPANY_DASHBOARD_ASSET_DECOMMISSION}/scrape` },
];

export default function AssetStatsCards({ stats }: AssetStatsCardsProps) {
  return (
    <section className="mb-6">
      <h2 className="text-[17px] font-bold text-gray-900 mb-4">Assets</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CARDS.map(({ label, key, bg, icon, href }) => (
          <div key={label} className={`${bg} rounded-2xl p-5 flex flex-col`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">{label}</span>
              {icon}
            </div>
            <span className="text-4xl font-bold text-gray-800 mb-4">
              {String(stats[key]).padStart(2, '0')}
            </span>
            <Link href={href} className="text-xs text-gray-500 hover:text-[#1A7DE8] transition-colors self-end flex items-center gap-1">
              View All
              <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <polyline points="6 3 11 8 6 13" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
