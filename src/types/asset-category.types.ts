export interface AssetCategory {
  id: string;
  categoryName: string;
  categoryCode?: string;
}


export interface AssetCategoriesResponse {
  data: AssetCategory[];
  total: number;
  page: number;
  pageSize: number;
}
