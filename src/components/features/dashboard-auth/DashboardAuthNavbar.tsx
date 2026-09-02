import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/src/constants/routes';

export default function DashboardAuthNavbar() {
  return (
    <nav className="bg-[#1A7DE8] h-14 flex items-center justify-between px-6 lg:px-10 flex-shrink-0">
      {/* Logo + brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1">
          <Image src="/Image/icon.svg" alt="Flutterflirt logo" width={22} height={22} />
        </div>
        <span className="text-white text-lg font-semibold tracking-wide">Flutterflirt</span>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-8">
        <Link
          href={ROUTES.LOGIN}
          className="text-white text-sm font-medium hover:text-blue-100 transition-colors"
        >
          Admin
        </Link>
        <Link
          href={ROUTES.DASHBOARD_LOGIN}
          className="text-white text-sm font-medium hover:text-blue-100 transition-colors"
        >
          Company User
        </Link>
      </div>
    </nav>
  );
}
