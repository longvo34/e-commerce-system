export type CategoryStatus = "ACTIVE" | "INACTIVE" | string;

export interface Category {
  id: number;
  categoryName: string;
  status?: CategoryStatus;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface CategoryListParams {
  status?: "ACTIVE" | "INACTIVE" | string;
}

export interface CreateCategoryPayload {
  categoryName: string;
}

export interface UpdateCategoryPayload {
  categoryName?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
}
