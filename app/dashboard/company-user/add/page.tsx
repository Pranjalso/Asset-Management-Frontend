'use client';

import { DashboardLayout } from '@/src/components/layout';
import { AddCompanyUserForm } from '@/src/components/features/company-user';
import { companyUserService } from '@/src/services/company-user.service';
import type { AddCompanyUserFormState } from '@/src/types';

export default function AddCompanyUserPage() {
  const handleSubmit = async (data: AddCompanyUserFormState) => {
    await companyUserService.create({
      companyName: data.companyName,
      companyGST: data.companyGST,
      mobileNumber: data.mobileNumber,
      companyEmail: data.companyGmail,
      uniqueCode: data.uniqueCode,
      subscriptionName: data.subscriptionName,
      subscriptionFromDate: data.subscriptionFromDate || null,
      subscriptionToDate: data.subscriptionToDate || null,
      totalUserInCompany: data.totalUserInCompany,
      status: 'active',
      blockedReason: '',
    });
  };

  return (
    <DashboardLayout title="Company User">
      <AddCompanyUserForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}
