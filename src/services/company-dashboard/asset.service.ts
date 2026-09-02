import { assetsService } from '../assets.service';
import type { Asset, AssetsResponse } from '@/src/types';

type BackendAsset = {
  id: string;
  name?: string;
  assetName?: string;
  recycleReason?: string;
  recycledAt?: string | null;
  description: string;
  categoryId?: string | null;
  categoryName?: string;
  branchId?: string | null;
  branchName?: string;
  departmentId?: string | null;
  departmentName?: string;
  serialNumber?: string;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  currentValue?: number | null;
  status?: string;
  condition?: string;
  location?: string;
  imageUrl?: string;
  assetImage?: string;
  createdAt: string;
  updatedAt: string;
  vendorName?: string;
  assetQuantity?: number;
  quantity?: number;
  shelfLife?: string;
  assetShelfLife?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  assetCompanyName?: string;
  acquisitionCost?: number | null;
  acquisitionDate?: string | null;
  recycle_reason?: string;
  recycled_at?: string | null;
  vendor_name?: string;
  shelf_life?: string;
  invoice_no?: string;
  invoice_date?: string;
  asset_company_name?: string;
};

function mapBackendAsset(asset: BackendAsset): Asset {
  return {
    id: asset.id,
    assetName: asset.assetName ?? asset.name ?? '',
    assetCategory: asset.categoryName ?? '',
    assetQuantity: asset.assetQuantity ?? asset.quantity ?? 1,
    assetCompanyName: asset.assetCompanyName ?? asset.asset_company_name ?? '',
    assetShelfLife: asset.assetShelfLife ?? asset.shelfLife ?? asset.shelf_life ?? '',
    assetImage: asset.assetImage ?? asset.imageUrl,
    invoiceNo: asset.invoiceNo ?? asset.invoice_no ?? '',
    invoiceDate: asset.invoiceDate ?? asset.invoice_date ?? asset.acquisitionDate ?? asset.purchaseDate ?? '',
    vendorName: asset.vendorName ?? asset.vendor_name ?? '',
    acquisitionCost: (asset.acquisitionCost ?? asset.purchasePrice)?.toString() ?? '',
    acquisitionDate: asset.acquisitionDate ?? asset.purchaseDate ?? '',
    assetDescription: asset.description,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}

function parseNumeric(value: string | number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(num) ? undefined : num;
}

export const assetService = {
  getAll: async (
    page = 1,
    pageSize = 20,
    categoryId?: string
  ): Promise<AssetsResponse> => {
    const response = await assetsService.list({ page, pageSize, category: categoryId });
    return {
      data: response.data.map((asset) => mapBackendAsset(asset as BackendAsset)),
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
    };
  },

  getById: async (id: string): Promise<Asset> => {
    const asset = await assetsService.getById(id);
    return mapBackendAsset(asset as BackendAsset);
  },

  create: async (data: Omit<Asset, 'id'>): Promise<Asset> => {
    const asset = await assetsService.create({
      name: data.assetName,
      description: data.assetDescription,
      image_url: data.assetImage,
      purchase_date: data.acquisitionDate,
      purchase_price: parseNumeric(data.acquisitionCost),
      serial_number: (data as unknown as Record<string, unknown>).serialNumber as string | undefined,
      branch_id: (data as unknown as Record<string, unknown>).branchId as string | undefined,
      department_id: (data as unknown as Record<string, unknown>).departmentId as string | undefined,
      vendor_name: data.vendorName,
      quantity: parseNumeric(data.assetQuantity),
      shelf_life: data.assetShelfLife,
      invoice_no: data.invoiceNo,
      invoice_date: data.invoiceDate,
      asset_company_name: data.assetCompanyName,
      category_id: data.categoryId, // Ensure categoryId is sent
      assetCategory: data.assetCategory, // Keep string for fallback mapping
    } as any);
    return mapBackendAsset(asset as BackendAsset);
  },

  update: async (id: string, data: Partial<Asset>): Promise<Asset> => {
    const asset = await assetsService.update(id, {
      name: data.assetName,
      description: data.assetDescription,
      image_url: data.assetImage,
      purchase_date: data.acquisitionDate,
      purchase_price: data.acquisitionCost !== undefined ? parseNumeric(data.acquisitionCost) : undefined,
      serial_number: (data as unknown as Record<string, unknown>).serialNumber as string | undefined,
      branch_id: (data as unknown as Record<string, unknown>).branchId as string | undefined,
      department_id: (data as unknown as Record<string, unknown>).departmentId as string | undefined,
      vendor_name: data.vendorName,
      quantity: data.assetQuantity !== undefined ? parseNumeric(data.assetQuantity) : undefined,
      shelf_life: data.assetShelfLife,
      invoice_no: data.invoiceNo,
      invoice_date: data.invoiceDate,
      asset_company_name: data.assetCompanyName,
      category_id: data.categoryId,
      assetCategory: data.assetCategory,
    } as any);
    return mapBackendAsset(asset as BackendAsset);
  },

  delete: async (id: string): Promise<void> => {
    await assetsService.delete(id);
  },

  listRecycled: async (): Promise<Asset[]> => {
    const assets = await assetsService.listRecycled();
    return assets.map((asset) => mapBackendAsset(asset as BackendAsset));
  },

  moveToBin: async (id: string, reason?: string): Promise<void> => {
    await assetsService.recycle(id, reason);
  },

  restore: async (id: string): Promise<void> => {
    await assetsService.restore(id);
  },
};
