'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ROUTES } from '@/src/constants/routes';
import { LogoutModal } from '@/src/components/features/shared';
import { useAuthContext } from '@/src/providers/AuthProvider';

/* ── Icons ── */
const GridIcon    = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="7" height="7" rx="1.2" /><rect x="11" y="2" width="7" height="7" rx="1.2" /><rect x="2" y="11" width="7" height="7" rx="1.2" /><rect x="11" y="11" width="7" height="7" rx="1.2" /></svg>;
const PersonIcon  = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="6" r="3.5" /><path d="M2.5 17c0-3.5 3.4-6 7.5-6s7.5 2.5 7.5 6" /></svg>;
const HelpIcon    = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="16" height="16" rx="3.5" /><path d="M7.5 7.5a2.5 2.5 0 0 1 5 .8c0 1.7-2.5 2.2-2.5 2.2" /><circle cx="10" cy="14" r=".6" fill="currentColor" /></svg>;
const LogoutIcon  = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" /><polyline points="13 14 18 10 13 6" /><line x1="18" y1="10" x2="7" y2="10" /></svg>;
const ShieldIcon  = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><path d="M10 2L3 5v5c0 4.5 3 7.5 7 8.5C17 17.5 17 13.5 17 10V5L10 2z" /></svg>;
const TrashIcon   = () => <svg viewBox="0 0 20 20" className="w-[18px] h-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 5 4.5 5 17 5" /><path d="M16 5l-.8 11a1.5 1.5 0 0 1-1.5 1.4H6.3A1.5 1.5 0 0 1 4.8 16L4 5" /><path d="M8 9v5M12 9v5" /><path d="M7.5 5V3.5A.5.5 0 0 1 8 3h4a.5.5 0 0 1 .5.5V5" /></svg>;
const ChevronDown = ({ open }: { open: boolean }) => <svg viewBox="0 0 20 20" className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><polyline points="5 8 10 13 15 8" /></svg>;

interface NavChild { label: string; href: string; icon: React.ReactNode }
interface NavItem  { label: string; href: string; icon: React.ReactNode; children?: NavChild[] }

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Company User', href: ROUTES.COMPANY_USER, icon: <GridIcon />,
    children: [
      { label: 'All Company User', href: ROUTES.COMPANY_USER, icon: <GridIcon /> },
      { label: 'Blocked Asset', href: ROUTES.COMPANY_USER_BLOCKED, icon: <ShieldIcon /> }
    ],
  },
  {
    label: 'Employee User', href: ROUTES.EMPLOYEE_USER, icon: <PersonIcon />,
    children: [
      { label: 'All Employees', href: ROUTES.EMPLOYEE_USER,            icon: <PersonIcon /> },
      { label: 'Add Employee',  href: ROUTES.EMPLOYEE_USER_ADD,        icon: <PersonIcon /> },
      { label: 'Recycle Bin',   href: ROUTES.EMPLOYEE_USER_RECYCLE_BIN, icon: <TrashIcon /> },
    ],
  },
  { label: 'Help Center', href: ROUTES.HELP_CENTER, icon: <HelpIcon /> },
  { label: 'Logout',      href: '/',               icon: <LogoutIcon /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutAdmin, adminUser } = useAuthContext();

  const defaultExpanded = NAV_ITEMS.find((item) =>
    item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/'))
  )?.label ?? null;

  const [expanded, setExpanded]   = useState<string | null>(defaultExpanded);
  const [showLogout, setShowLogout] = useState(false);

  const handleItemClick = (item: NavItem) => {
    if (item.label === 'Logout') {
      setShowLogout(true);
      return;
    }
    if (item.children) {
      setExpanded((p) => (p === item.label ? null : item.label));
      return;
    }
    router.push(item.href);
  };

  const handleLogoutConfirm = async () => {
    await logoutAdmin();
    router.replace('/');
  };

  return (
    <aside className="w-[200px] shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <nav className="flex-1 pt-4 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label !== 'Logout' && pathname === item.href;
          const isExpanded = expanded === item.label;
          return (
            <div key={item.label}>
              <button onClick={() => handleItemClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-[#1A7DE8] text-white [&_svg]:stroke-white' : 'text-gray-800 hover:bg-gray-100 [&_svg]:stroke-[#1A7DE8]'}`}>
                <div className="flex items-center gap-2.5">{item.icon}<span>{item.label}</span></div>
                {item.children && <ChevronDown open={isExpanded} />}
              </button>
              {item.children && isExpanded && (
                <div className="mt-0.5 ml-2 space-y-0.5 pb-1">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link key={child.href} href={child.href}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors whitespace-nowrap ${isChildActive ? 'bg-[#1A7DE8] text-white [&_svg]:stroke-white' : 'text-gray-700 hover:bg-gray-100 [&_svg]:stroke-[#1A7DE8]'}`}>
                        {child.icon}{child.label}
                      </Link>
                    );
                  })}
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
        userName={adminUser?.name}
      />
    </aside>
  );
}
