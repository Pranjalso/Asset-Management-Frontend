'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { dashboardService } from '@/src/services/dashboard.service';
import { assetCategoryService } from '@/src/services/company-dashboard/asset-category.service';

const BAR_COLORS = ['#CDED81', '#88D6F2', '#FA8A85', '#2790F3', '#13E5A4', '#FFB8B8', '#B39DDB', '#FFD54F'];

interface ChartDatum {
  name: string;
  cost: number;
  color: string;
}

interface Category {
  id: string;
  categoryName: string;
}

// Custom Axis Tick component to support multi-line labels
const CustomizedAxisTick = ({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value?: string };
}) => {
  const lines = (payload?.value || '').split('\n');
  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line: string, index: number) => (
        <text
          key={index}
          x={0}
          y={15 + index * 15}
          dy={0}
          textAnchor="middle"
          fill="#4B5563"
          fontSize={11}
          fontWeight={500}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const CustomYAxisTick = ({
  x,
  y,
}: {
  x?: number;
  y?: number;
}) => {
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fill="#4B5563" fontSize={11} fontWeight={500}>
      {' '}
    </text>
  );
};

// Reusable Categories Dropdown
function CategoriesDropdown({
  categories,
  selectedCategoryId,
  onSelect,
}: {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel =
    categories.find((c) => c.id === selectedCategoryId)?.categoryName || 'Categories';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 bg-[#DCEBFE] hover:bg-[#cde0fa] text-gray-800 px-4 py-2 rounded-xl text-[13px] font-bold transition-colors"
      >
        {selectedLabel}
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 stroke-gray-800 stroke-[2.5] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 min-w-[170px] bg-white border border-gray-100 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
          <button
            onClick={() => { onSelect(null); setOpen(false); }}
            className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors hover:bg-blue-50 ${
              selectedCategoryId === null ? 'text-[#1A7DE8] bg-blue-50' : 'text-gray-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelect(cat.id); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors hover:bg-blue-50 ${
                selectedCategoryId === cat.id ? 'text-[#1A7DE8] bg-blue-50' : 'text-gray-700'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
          {categories.length === 0 && (
            <p className="px-4 py-2 text-[12px] text-gray-400">No categories found</p>
          )}
        </div>
      )}
    </div>
  );
}

const ChartCard = ({
  title,
  data,
  xLabel,
  selectedCategoryId,
  onCategorySelect,
  loading,
  categories,
}: {
  title: string;
  data: ChartDatum[];
  xLabel: string;
  selectedCategoryId: string | null;
  onCategorySelect: (id: string | null) => void;
  loading: boolean;
  categories: Category[];
}) => (
  <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6]">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{title}</h2>
      <CategoriesDropdown
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onCategorySelect}
      />
    </div>

    <div className="h-[280px] w-full relative pl-6">
      <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 -rotate-90 text-[12px] font-bold text-gray-900 tracking-wider">
        Cost
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 20, bottom: 40 }} barSize={20}>
          <XAxis
            dataKey="name"
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tick={<CustomYAxisTick />}
            domain={[0, 'auto']}
            tickCount={6}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Cost']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E9EFF6', fontSize: '13px' }}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 text-center text-[13px] font-bold text-gray-900">
        {xLabel}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[13px] font-medium text-gray-500 z-10">
          Loading chart...
        </div>
      )}
      {!loading && data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-gray-400">
          No data available
        </div>
      )}
    </div>
  </div>
);

export const AssetUsageCharts = () => {
  const [deptData, setDeptData] = useState<ChartDatum[]>([]);
  const [branchData, setBranchData] = useState<ChartDatum[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDeptCategoryId, setSelectedDeptCategoryId] = useState<string | null>(null);
  const [selectedBranchCategoryId, setSelectedBranchCategoryId] = useState<string | null>(null);
  const [deptLoading, setDeptLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    try {
      const catRes = await assetCategoryService.getAll();
      setCategories(catRes.data || []);
    } catch {}
  }, []);

  const loadDeptData = useCallback(async (catId: string | null) => {
    setDeptLoading(true);
    try {
      const usage = await dashboardService.getCompanyUsage(catId);
      setDeptData(
        (usage.departmentCosts || []).map((d, i) => ({
          name: (d.name || 'Unassigned').replace(/(.{12})/g, '$1\n'),
          cost: Number(d.cost) || 0,
          color: BAR_COLORS[i % BAR_COLORS.length],
        }))
      );
    } catch {
      setDeptData([]);
    } finally {
      setDeptLoading(false);
    }
  }, []);

  const loadBranchData = useCallback(async (catId: string | null) => {
    setBranchLoading(true);
    try {
      const usage = await dashboardService.getCompanyUsage(catId);
      setBranchData(
        (usage.branchCosts || []).map((d, i) => ({
          name: (d.name || 'Unassigned').replace(/(.{12})/g, '$1\n'),
          cost: Number(d.cost) || 0,
          color: BAR_COLORS[i % BAR_COLORS.length],
        }))
      );
    } catch {
      setBranchData([]);
    } finally {
      setBranchLoading(false);
    }
  }, []);

  useEffect(() => { void loadCategories(); }, [loadCategories]);
  
  useEffect(() => { void loadDeptData(selectedDeptCategoryId); }, [loadDeptData, selectedDeptCategoryId]);
  useEffect(() => { void loadBranchData(selectedBranchCategoryId); }, [loadBranchData, selectedBranchCategoryId]);

  // Filter data by selected category (future: pass categoryId to API for real filtering)
  const maxCost = Math.max(1000, ...deptData.map((d) => d.cost), ...branchData.map((d) => d.cost));

const ChartCard = ({
  title,
  data,
  xLabel,
  selectedCategoryId,
  onCategorySelect,
  loading,
  categories,
}: {
  title: string;
  data: ChartDatum[];
  xLabel: string;
  selectedCategoryId: string | null;
  onCategorySelect: (id: string | null) => void;
  loading: boolean;
  categories: Category[];
}) => (
  <div className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-[#E9EFF6]">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">{title}</h2>
      <CategoriesDropdown
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelect={onCategorySelect}
      />
    </div>

    <div className="h-[280px] w-full relative pl-6">
      <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 -rotate-90 text-[12px] font-bold text-gray-900 tracking-wider">
        Cost
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 10, left: 20, bottom: 40 }} barSize={20}>
          <XAxis
            dataKey="name"
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tick={<CustomizedAxisTick />}
          />
          <YAxis
            axisLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tickLine={{ stroke: '#E5E7EB', strokeWidth: 1.5 }}
            tick={<CustomYAxisTick />}
            domain={[0, 'auto']}
            tickCount={6}
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip
            formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Cost']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E9EFF6', fontSize: '13px' }}
          />
          <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 text-center text-[13px] font-bold text-gray-900">
        {xLabel}
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 text-[13px] font-medium text-gray-500 z-10">
          Loading chart...
        </div>
      )}
      {!loading && data.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-gray-400">
          No data available
        </div>
      )}
    </div>
  </div>
);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <ChartCard
        title="Dept Asset Usage"
        data={deptData}
        xLabel="Department Name"
        selectedCategoryId={selectedDeptCategoryId}
        onCategorySelect={setSelectedDeptCategoryId}
        loading={deptLoading}
        categories={categories}
      />
      <ChartCard
        title="Branch Asset Usage"
        data={branchData}
        xLabel="Branch Name"
        selectedCategoryId={selectedBranchCategoryId}
        onCategorySelect={setSelectedBranchCategoryId}
        loading={branchLoading}
        categories={categories}
      />
    </div>
  );
};
