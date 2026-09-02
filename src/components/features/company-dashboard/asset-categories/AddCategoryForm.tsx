'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/src/constants/routes';
import { assetCategoryService } from '@/src/services/company-dashboard/asset-category.service';

export interface AddCategoryFormState {
  categoryName: string;
  categoryCode: string;
}

interface AddCategoryFormProps {
  onSubmit?: (data: AddCategoryFormState, editId?: string) => Promise<void> | void;
}

// ── Inner form — needs Suspense boundary for useSearchParams ─────────────────
function CategoryFormInner({ onSubmit }: AddCategoryFormProps) {
  const router      = useRouter();
  const searchParams = useSearchParams();
  const editId      = searchParams.get('editId') ?? undefined;
  const isEditing   = !!editId;

  const [form, setForm]       = useState<AddCategoryFormState>({ categoryName: '', categoryCode: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError]     = useState<string | null>(null);

  // Pre-populate fields when editing
  useEffect(() => {
    if (!editId) return;

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!API_BASE) {
      // No backend — we can't fetch. Keep empty form but don't show error.
      setFetching(false);
      return;
    }

    setFetching(true);
    assetCategoryService.getAll()
      .then((res) => {
        const category = res.data.find((c) => c.id === editId);
        if (category) {
          setForm({ categoryName: category.categoryName, categoryCode: category.categoryCode ?? '' });
        }
      })
      .catch(() => setError('Failed to load category details.'))
      .finally(() => setFetching(false));
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName.trim()) { setError('Category Name is required.'); return; }
    setError(null);
    try {
      setLoading(true);
      if (onSubmit) {
        await onSubmit(form, editId);
      } else {
        // Default behaviour when used standalone
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (API_BASE) {
          if (isEditing && editId) {
            await assetCategoryService.update(editId, form);
          } else {
            await assetCategoryService.create(form);
          }
        }
      }
      router.push(ROUTES.COMPANY_DASHBOARD_ASSET_CATEGORIES);
    } catch {
      setError(isEditing ? 'Failed to update category.' : 'Failed to create category.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-full bg-[#E8EEF7] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#E8EEF7] flex items-start justify-center p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button type="button" onClick={() => router.back()} aria-label="Go back"
            className="text-gray-900 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Category' : 'Add Categories'}
          </h1>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-10">
            {/* Category Name */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Category Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.categoryName}
                onChange={(e) => setForm((p) => ({ ...p, categoryName: e.target.value }))}
                disabled={loading}
                placeholder="Enter category name"
                className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow disabled:opacity-50"
              />
            </div>

            {/* Category Code */}
            <div>
              <label className="block text-[13px] font-medium text-gray-700 mb-2">
                Category Code
              </label>
              <input
                type="text"
                value={form.categoryCode}
                onChange={(e) => setForm((p) => ({ ...p, categoryCode: e.target.value }))}
                disabled={loading}
                placeholder="Enter category code"
                className="w-full px-4 py-3 rounded-xl bg-[#EEF4FC] border-0 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8] transition-shadow disabled:opacity-50"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} disabled={loading}
              className="px-7 py-2.5 rounded-full border border-gray-900 text-gray-900 text-sm font-semibold bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-8 py-2.5 rounded-full bg-[#1A7DE8] hover:bg-[#1669C9] disabled:opacity-60 text-white text-sm font-semibold transition-colors">
              {loading ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save Changes' : 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Public export — wraps inner form with Suspense for useSearchParams ────────
export default function AddCategoryForm(props: AddCategoryFormProps) {
  return (
    <Suspense fallback={
      <div className="min-h-full bg-[#E8EEF7] flex items-center justify-center p-8">
        <div className="w-10 h-10 border-4 border-[#1A7DE8] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CategoryFormInner {...props} />
    </Suspense>
  );
}
