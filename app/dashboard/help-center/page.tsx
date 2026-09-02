'use client';

import { DashboardLayout } from '@/src/components/layout';

const ADMIN_HELP_TOPICS = [
  {
    title: 'Managing companies',
    description: 'Create companies, review profile details, block inactive accounts, and monitor organization access from the admin dashboard.',
  },
  {
    title: 'Managing employee users',
    description: 'Add employee users, recover recycled accounts, and verify company-user mappings before granting access.',
  },
  {
    title: 'Profile and security',
    description: 'Update your profile, upload an avatar, change your password, and verify your session remains active across admin pages.',
  },
];

const ADMIN_QUICK_STEPS = [
  'Check that the backend server is running on port 3000 before testing admin actions.',
  'Confirm the target company exists before creating or assigning employee users.',
  'Review notifications for recent company or account activity after major admin changes.',
];

export default function HelpCenterPage() {
  return (
    <DashboardLayout title="Help Center">
      <div className="p-6 flex flex-col h-full overflow-y-auto bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto w-full space-y-6">
          <section className="bg-white border border-[#E9EFF6] rounded-3xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Help Center</h2>
            <p className="text-sm text-gray-600 leading-6">
              Use this space to troubleshoot admin workflows, verify setup, and follow the recommended steps for keeping company and employee data accurate.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ADMIN_HELP_TOPICS.map((topic) => (
              <div key={topic.title} className="bg-white border border-[#E9EFF6] rounded-2xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-sm text-gray-600 leading-6">{topic.description}</p>
              </div>
            ))}
          </section>

          <section className="bg-white border border-[#E9EFF6] rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended checks</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              {ADMIN_QUICK_STEPS.map((step) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1A7DE8] shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
