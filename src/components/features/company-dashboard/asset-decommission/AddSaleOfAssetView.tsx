'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assetOpsService } from '@/src/services/assetOps.service';
import { useAssets } from '@/src/hooks/company-dashboard/useAssets';

export function AddSaleOfAssetView() {
  const router = useRouter();
  const { assets } = useAssets();
  
  // Form State
  const [assetId, setAssetId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [invoiceSoldCost, setInvoiceSoldCost] = useState('');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState<string[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    assetOpsService.listDecommissions({ pageSize: 500 }).then((res) => {
      if (!cancelled) {
        const unique = Array.from(new Set(
          res.data
            .filter(d => d.decommissionType === 'sale' && d.customerName)
            .map(d => d.customerName)
        )).filter(Boolean) as string[];
        setCustomers(unique);
      }
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!assetId) {
      setError('Asset is required');
      return;
    }
    if (!customerName.trim()) {
      setError('Customer name is required');
      return;
    }
    if (!invoiceSoldCost.trim()) {
      setError('Invoice sold cost is required');
      return;
    }
    if (isNaN(parseFloat(invoiceSoldCost))) {
      setError('Invoice sold cost must be a valid number');
      return;
    }
    if (!invoiceDate) {
      setError('Invoice date is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await assetOpsService.createDecommission({
        asset_id: assetId,
        decommission_type: 'sale',
        sale_price: parseFloat(invoiceSoldCost),
        customer_name: customerName.trim(),
        invoice_number: invoiceNo.trim() || undefined,
        invoice_date: invoiceDate,
        reason: condition.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err
        ? String((err as { message: unknown }).message)
        : 'Failed to create asset sale';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] sm:rounded-[32px] p-5 sm:p-7 lg:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6]">
      
      {/* ── Top Header Row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-8">
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
          Add Sale of Asset
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        
        {/* Grid Layout for Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 mb-8 items-start">
          
          {/* Col 1 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Asset Name
              </label>
              <div className="relative w-full">
                <select
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  className="w-full appearance-none bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer"
                >
                  <option value="" disabled hidden>Select Asset</option>
                  {assets.map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.assetName}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                  <svg className="w-4 h-4 stroke-gray-900" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all"
              />
            </div>
          </div>

          {/* Col 2 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Customer Name
              </label>
              <div className="relative w-full">
                {customers.length > 0 ? (
                  <select
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full appearance-none bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 pl-4 pr-10 rounded-[12px] border-0 focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all cursor-pointer"
                  >
                    <option value="" disabled hidden>Select Customer</option>
                    {customers.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all"
                  />
                )}
                {customers.length > 0 && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <svg className="w-4 h-4 stroke-gray-900" fill="none" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Invoice Sold Cost
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={invoiceSoldCost}
                onChange={(e) => setInvoiceSoldCost(e.target.value)}
                className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all"
              />
            </div>
          </div>

          {/* Col 3 */}
          <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Invoice No (Optional)
              </label>
              <input
                type="text"
                placeholder="Number"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all"
              />
            </div>
            <div className="flex flex-col flex-1 h-full">
              <label className="text-[13px] font-bold text-gray-600 mb-2">
                Condition at the Time of Selling
              </label>
              <textarea
                placeholder="Type condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full flex-1 min-h-[90px] bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all resize-none"
              />
            </div>
          </div>

          {/* Row 3 - Notes */}
          <div className="flex flex-col md:col-span-3">
            <label className="text-[13px] font-bold text-gray-600 mb-2">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#F5F8FC] text-gray-800 text-[13.5px] font-medium py-3 px-4 rounded-[12px] border-0 placeholder-[#8B9EB7] focus:outline-none focus:ring-2 focus:ring-[#1A7DE8]/40 transition-all resize-none"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-[#E9EFF6]">
          <button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold text-gray-900 bg-white border-2 border-[#1A7DE8] text-[#1A7DE8] hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 rounded-xl text-[14px] font-bold bg-[#007AFF] hover:bg-[#0062CC] text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

      </form>
    </div>
  );
}

export default AddSaleOfAssetView;
