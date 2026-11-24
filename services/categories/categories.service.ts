import api from "../api";
import {
  Category,
  CategoryListParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

/**
 * 1. GET /categories - Danh sách danh mục (công khai)
 * @param params { status?: "ACTIVE" | "INACTIVE" }
 */
export async function getCategories(
  params?: CategoryListParams
): Promise<Category[]> {
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== "ALL") {
    searchParams.append("status", params.status);
  }

  const qs = searchParams.toString();
  return await api.get<Category[]>(`/categories${qs ? `?${qs}` : ""}`);
}

/**
 * 2. POST /categories - Thêm danh mục mới (PRODUCT_STAFF, ADMIN)
 * @param data { categoryName: string }
 */
export async function createCategory(
  data: CreateCategoryPayload
): Promise<Category> {
  return await api.post<Category>("/categories", data);
}

/**
 * 3. GET /categories/{id} - Chi tiết danh mục (công khai)
 * @param id ID của danh mục
 */
export async function getCategoryById(id: number | string): Promise<Category> {
  return await api.get<Category>(`/categories/${id}`);
}

/**
 * 4. PATCH /categories/{id} - Chỉnh sửa danh mục (PRODUCT_STAFF, ADMIN)
 * @param id ID của danh mục
 * @param data { categoryName?: string, status?: "ACTIVE" | "INACTIVE" }
 */
export async function updateCategory(
  id: number | string,
  data: UpdateCategoryPayload
): Promise<Category> {
  return await api.patch<Category>(`/categories/${id}`, data);
}

/**
 * 5. DELETE /categories/{id} - Xóa danh mục (Chỉ xóa được khi danh mục không còn sản phẩm nào liên kết) (PRODUCT_STAFF, ADMIN)
 * @param id ID của danh mục
 */
export async function deleteCategory(id: number | string): Promise<unknown> {
  return await api.delete(`/categories/${id}`);
}

/**
 * 6. PATCH /categories/{id}/deactivate - Ngừng sử dụng danh mục (status -> INACTIVE) (PRODUCT_STAFF, ADMIN)
 * @param id ID của danh mục
 */
export async function deactivateCategory(
  id: number | string
): Promise<Category> {
  return await api.patch<Category>(`/categories/${id}/deactivate`);
}

export const categoriesService = {
  getCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  deactivateCategory,
};

export default categoriesService;
