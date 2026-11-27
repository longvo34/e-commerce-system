import type { Category } from "./categories";

export type { Category };

export type ProductStatus = "ON_SALE" | "DISCONTINUED" | "ALL" | string;

export interface Product {
  id: number;
  productName: string;
  skuCode: string;
  price: number;
  status: ProductStatus;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  categories?: Category[];
  categoryIds?: number[];
  description?: string;
  stock?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ProductListParams {
  search?: string;
  categoryId?: number | string;
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateProductPayload {
  productName: string;
  skuCode: string;
  price: number;
  categoryIds: number[];
  categoryId?: number;
  description?: string;
  imageUrl?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface UploadProductImageResponse {
  imageUrl: string;
  [key: string]: unknown;
}
