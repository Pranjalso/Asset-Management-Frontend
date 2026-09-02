'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { useDepartments } from '@/src/hooks/company-dashboard/useDepartments';
import { DeleteButton } from '@/src/components/ui/DeleteButton';
import { DeleteConfirmModal } from '@/src/components/ui/DeleteConfirmModal';
import type { Department } from '@/src/types';

interface DepartmentCardProps {
  department: Department;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DepartmentCard = ({
  department,
  onEdit,
  onDelete,
}: DepartmentCardProps) => {
  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6] mb-6">
      
      {/* Grid Layout for Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6">
        
        {/* Row 1 */}
        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Department Name
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium py-3 px-4 rounded-xl border-0">
            {department.departmentName}
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[13px] font-bold text-gray-700 mb-2.5">
            Department Manager Name
          </label>
          <div className="w-full bg-[#DCEBFE] text-[#8B9EB7] text-[13.5px] font-medium py-3 px-4 rounded-xl border-0">
            {department.deptManagerName}
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => onEdit(department.id)}
          className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 bg-white border-2 border-[#E9EFF6] hover:bg-gray-50 transition-colors"
        >
          Edit
        </button>
        <DeleteButton onClick={() => onDelete(department.id)} />
      </div>

    </div>
  );
};

export function DepartmentManagementView({ searchQuery = '' }: { searchQuery?: string }) {
  const router = useRouter();
  const { departments, loading, error, deleteDepartment } = useDepartments(searchQuery);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  };

  const handleCreate = () => {
    router.push(`${ROUTES.COMPANY_DASHBOARD_DEPARTMENT}/add`);
  };

  const handleEdit = (id: string) => {
    router.push(`${ROUTES.COMPANY_DASHBOARD_DEPARTMENT}/add?editId=${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDepartment(deleteId);
    } catch {
      alert('Failed to delete department. Please try again.');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const filteredDepartments = departments.filter(dept => 
    !searchQuery || 
    dept.departmentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dept.deptManagerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col max-w-[1200px] mx-auto overflow-hidden p-2 sm:p-4">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-3">
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
            Department Management
          </h2>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-[#1A7DE8] hover:bg-[#1669C9] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 stroke-white stroke-[2]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Create
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto pb-8 pr-1 custom-scrollbar">
        {filteredDepartments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg font-medium">No departments found</p>
            <p className="text-sm mt-2">Click Create to add your first department</p>
          </div>
        ) : (
          filteredDepartments.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteId}
        title="Delete Department"
        message="Are you sure you want to delete this department? It will be moved to the Recycle Bin."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

    </div>
  );
}

export default DepartmentManagementView;
