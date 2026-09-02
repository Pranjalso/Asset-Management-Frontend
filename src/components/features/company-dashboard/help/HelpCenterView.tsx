'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const HELP_SECTIONS = [
  {
    title: 'Asset operations',
    description: 'Create, review, transfer, and decommission assets using the company dashboard. Always verify categories and company records before creating new assets.',
  },
  {
    title: 'Branch and department setup',
    description: 'Keep branch and department details updated so usage, transfers, and reporting stay accurate throughout the organization.',
  },
  {
    title: 'Usage and reporting',
    description: 'Use asset usage records and dashboard analytics to understand where assets are assigned and how operating costs are distributed.',
  },
];

const SUPPORT_TIPS = [
  'Create asset categories before adding new assets to avoid incomplete records.',
  'Review notifications for recent activity after transfers, usage updates, or profile changes.',
  'If a screen is empty, confirm the company has seeded or newly created data in branches, departments, assets, and employees.',
];

export function HelpCenterView() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto overflow-hidden p-2 sm:p-4">
      <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8 shrink-0">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="w-8 h-8 flex items-center justify-center text-gray-900 hover:text-[#1A7DE8] hover:bg-blue-50 rounded-full transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-gray-900 stroke-[2.8]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2 className="text-[20px] sm:text-[22px] font-bold text-gray-900 tracking-tight">
            Help Center
          </h2>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-[#F8FBFF] border border-[#DCEBFE] p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Dashboard Support</h3>
            <p className="text-sm text-gray-600 leading-6">
              Find guidance for managing assets, organization data, and activity tracking across your company workspace.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HELP_SECTIONS.map((section) => (
              <div key={section.title} className="rounded-2xl border border-[#E9EFF6] p-5 bg-white shadow-sm">
                <h4 className="text-base font-semibold text-gray-900 mb-2">{section.title}</h4>
                <p className="text-sm text-gray-600 leading-6">{section.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-[#E9EFF6] p-5 bg-white shadow-sm">
            <h4 className="text-base font-semibold text-gray-900 mb-3">Best-practice checklist</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              {SUPPORT_TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#1A7DE8] shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterView;
