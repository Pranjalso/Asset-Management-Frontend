'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/src/constants/routes';
import { LogoutModal } from '@/src/components/features/shared';
import { useAuthContext } from '@/src/providers/AuthProvider';

/* ── Precise Icons matching screenshot ───────────────────────────────────── */

const DashboardIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const AssetCategoriesIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="7" r="1.5" />
    <line x1="10" y1="7" x2="20" y2="7" strokeWidth={2} />
    <circle cx="5" cy="12" r="1.5" />
    <line x1="10" y1="12" x2="20" y2="12" strokeWidth={2} />
    <circle cx="5" cy="17" r="1.5" />
    <line x1="10" y1="17" x2="20" y2="17" strokeWidth={2} />
  </svg>
);

const AssetsIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <line x1="7" y1="9" x2="17" y2="9" strokeWidth={2} />
    <line x1="7" y1="13" x2="14" y2="13" strokeWidth={2} />
  </svg>
);

const BranchIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12" />
    <path d="M12 9a5 5 0 0 1 5-5" />
    <path d="M12 9a5 5 0 0 0-5-5" />
    <circle cx="12" cy="19" r="2.5" />
    <circle cx="17" cy="4" r="2" />
    <circle cx="7" cy="4" r="2" />
  </svg>
);

const DepartmentIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="3" width="6" height="5" rx="1" />
    <rect x="3" y="16" width="6" height="5" rx="1" />
    <rect x="15" y="16" width="6" height="5" rx="1" />
    <path d="M12 8v4" />
    <path d="M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
  </svg>
);

const AssetUsageIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.5 2v6h-6" />
    <path d="M2.5 22v-6h6" />
    <path d="M19.9 11a8.5 8.5 0 0 0-14.8-4.5L2.5 9" />
    <path d="M4.1 13a8.5 8.5 0 0 0 14.8 4.5l2.6-2.5" />
  </svg>
);

const AssetTransferIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 20V4m0 0L3 8m4-4 4 4" />
    <path d="M17 4v16m0 0 4-4m-4 4-4-4" />
  </svg>
);

const AssetDecommissionIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="2.5" />
    <path d="M3 9h18" />
    <path d="M9 13l6 4M15 13l-6 4" strokeWidth={1.5} />
  </svg>
);

const HelpIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth={3} />
  </svg>
);

const RecycleBinIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const LogoutIcon = ({ className = 'w-[19px] h-[19px]' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={`${className} shrink-0`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" strokeWidth={2} />
  </svg>
);

const ChevronDown = ({ open, isWhite }: { open: boolean; isWhite?: boolean }) => (
  <svg
    viewBox="0 0 20 20"
    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
      open ? 'rotate-180' : ''
    } ${isWhite ? 'stroke-white' : 'stroke-gray-600'}`}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
  >
    <polyline points="5 8 10 13 15 8" />
  </svg>
);

/* ── Nav Items Definition ─────────────────────────────────────────────────── */

interface NavChild {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
  children?: NavChild[];
  hasDropdown?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: ROUTES.COMPANY_DASHBOARD,
    icon: () => <DashboardIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
  {
    label: 'Asset Categories',
    href: ROUTES.COMPANY_DASHBOARD_ASSET_CATEGORIES,
    icon: () => <AssetCategoriesIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
  {
    label: 'Assets',
    href: ROUTES.COMPANY_DASHBOARD_ASSETS,
    hasDropdown: true,
    icon: (active) => (
      <AssetsIcon className={`w-[18px] h-[18px] ${active ? 'text-white' : 'text-[#1A7DE8]'}`} />
    ),
    children: [
      { label: 'All Assets', href: ROUTES.COMPANY_DASHBOARD_ASSETS },
      { label: 'Add Asset', href: ROUTES.COMPANY_DASHBOARD_ASSETS_ADD },
    ],
  },
  {
    label: 'Branch management',
    href: ROUTES.COMPANY_DASHBOARD_BRANCH,
    hasDropdown: true,
    icon: () => <BranchIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
    children: [
      { label: 'All Branches', href: ROUTES.COMPANY_DASHBOARD_BRANCH },
      { label: 'Add Branch', href: `${ROUTES.COMPANY_DASHBOARD_BRANCH}/add` },
    ],
  },
  {
    label: 'Department management',
    href: ROUTES.COMPANY_DASHBOARD_DEPARTMENT,
    hasDropdown: true,
    icon: () => <DepartmentIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
    children: [
      { label: 'All Departments', href: ROUTES.COMPANY_DASHBOARD_DEPARTMENT },
      { label: 'Add Department', href: `${ROUTES.COMPANY_DASHBOARD_DEPARTMENT}/add` },
    ],
  },
  {
    label: 'Asset Usage',
    href: ROUTES.COMPANY_DASHBOARD_ASSET_USAGE,
    icon: () => <AssetUsageIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
  {
    label: 'Asset Transfer',
    href: ROUTES.COMPANY_DASHBOARD_ASSET_TRANSFER,
    hasDropdown: true,
    icon: () => <AssetTransferIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
    children: [
      { label: 'Department', href: `${ROUTES.COMPANY_DASHBOARD_ASSET_TRANSFER}/department` },
      { label: 'Branch', href: `${ROUTES.COMPANY_DASHBOARD_ASSET_TRANSFER}/branch` },
    ],
  },
  {
    label: 'Asset Decommission',
    href: ROUTES.COMPANY_DASHBOARD_ASSET_DECOMMISSION,
    hasDropdown: true,
    icon: () => <AssetDecommissionIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
    children: [
      { label: 'Asset Sale', href: `${ROUTES.COMPANY_DASHBOARD_ASSET_DECOMMISSION}/sale` },
      { label: 'Asset Scrape', href: `${ROUTES.COMPANY_DASHBOARD_ASSET_DECOMMISSION}/scrape` },
    ],
  },
  {
    label: 'Recycle Bin',
    href: ROUTES.COMPANY_DASHBOARD_RECYCLE_BIN,
    icon: () => <RecycleBinIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
  {
    label: 'Help Center',
    href: ROUTES.COMPANY_DASHBOARD_HELP,
    icon: () => <HelpIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
  {
    label: 'Logout',
    href: '/',
    icon: () => <LogoutIcon className="w-[18px] h-[18px] text-[#1A7DE8]" />,
  },
];

interface CompanyDashboardSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function CompanyDashboardSidebar({
  mobileOpen = false,
  onCloseMobile,
}: CompanyDashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutDashboard, dashboardUser } = useAuthContext();

  const defaultExpanded = NAV_ITEMS.find((item) =>
    item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'))
  )?.label ?? 'Assets';

  const [expanded, setExpanded] = useState<string | null>(defaultExpanded);
  const [showLogout, setShowLogout] = useState(false);

  const handleItemClick = (item: NavItem) => {
    if (item.label === 'Logout') {
      setShowLogout(true);
      return;
    }
    if (item.children) {
      setExpanded((p) => (p === item.label ? null : item.label));
    }
  };

  const handleLogoutConfirm = async () => {
    await logoutDashboard();
  };

  const sidebarContent = (
    <div className="w-[230px] shrink-0 bg-white flex flex-col h-full select-none">
      {/* Nav */}
      <nav className="flex-1 px-3.5 pb-6 space-y-1.5 pt-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.label !== 'Logout' &&
            (pathname === item.href ||
              (item.href === ROUTES.COMPANY_DASHBOARD_ASSETS &&
                pathname.startsWith(ROUTES.COMPANY_DASHBOARD_ASSETS)));

          const isExpanded = expanded === item.label;

          return (
            <div key={item.label}>
              {item.children ? (
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#1A7DE8] text-white shadow-sm font-semibold'
                      : 'text-gray-800 hover:bg-[#F3F7FD]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon(isActive)}
                    <span className="leading-tight text-left truncate">{item.label}</span>
                  </div>
                  <ChevronDown open={isExpanded} isWhite={isActive} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={(e) => {
                    if (item.label === 'Logout') {
                      e.preventDefault();
                      setShowLogout(true);
                    }
                    onCloseMobile?.();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#1A7DE8] text-white shadow-sm font-semibold'
                      : 'text-gray-800 hover:bg-[#F3F7FD]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.icon(isActive)}
                    <span className="leading-tight text-left truncate">{item.label}</span>
                  </div>
                  {item.hasDropdown && <ChevronDown open={false} isWhite={isActive} />}
                </Link>
              )}

              {/* Child Submenu */}
              {item.children && isExpanded && (
                <div className="mt-1 ml-7 pl-3 border-l-2 border-blue-100 space-y-1 pb-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={onCloseMobile}
                      className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                        pathname === child.href
                          ? 'text-[#1A7DE8] font-bold bg-blue-50/60'
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <LogoutModal
        open={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogoutConfirm}
        userName={dashboardUser?.name}
      />
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden md:flex border-r border-[#E9EFF6] h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-[260px] w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">Navigation</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

