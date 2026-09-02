export interface Asset {
  id: string;
  assetName: string;
  assetCategory: string;
  assetCompanyName: string;
  vendorName: string;
  assetQuantity: string | number;
  assetImage?: string;
  createdAt?: string;
  updatedAt?: string;
  // Extended fields used in detail / create views
  categoryId?: string;
  assetShelfLife?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  acquisitionCost?: string | number;
  acquisitionDate?: string;
  assetDescription?: string;
}

export interface AssetsResponse {
  data: Asset[];
  total: number;
  page: number;
  pageSize: number;
}
