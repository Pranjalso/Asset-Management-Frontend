'use client';

import { DashboardLayout } from '@/src/components/layout';
import { AddEmployeeUserForm } from '@/src/components/features/employee-user';
import { employeeUserService } from '@/src/services/employee-user.service';
import type { AddEmployeeUserFormState } from '@/src/types';

export default function AddEmployeeUserPage() {
  const handleSubmit = async (data: AddEmployeeUserFormState) => {
    if (!data.companyId) {
      throw new Error('Please select an existing company before creating an employee.');
    }

    await employeeUserService.create({
      companyId: data.companyId,
      companyName: data.companyName,
      employeeName: data.employeeName,
      mobileNo: data.mobileNumber,
      designation: data.designation,
      email: data.email,
      password: data.password,
      status: 'active',
      recycleReason: '',
    });
  };

  return (
    <DashboardLayout title="Employee User">
      <AddEmployeeUserForm onSubmit={handleSubmit} />
    </DashboardLayout>
  );
}
