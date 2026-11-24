import api from "../api";
import {
    Product,
    ProductListParams,
    ProductListResponse,
    CreateProductPayload,
    UpdateProductPayload,
    UploadProductImageResponse,
} from "@/types";

/**
 * 1. GET /products - Danh sách sản phẩm có tìm kiếm và phân trang (Công khai)
 * @param params { search, categoryId, status, page, limit }
 */
export async function getProducts(
    params?: ProductListParams
): Promise<ProductListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append("search", params.search);
    if (params?.categoryId !== undefined && params?.categoryId !== "") {
        searchParams.append("categoryId", String(params.categoryId));
    }
    if (params?.status) searchParams.append("status", params.status);
    if (params?.page) searchParams.append("page", String(params.page));
    if (params?.limit) searchParams.append("limit", String(params.limit));

    const qs = searchParams.toString();
    return await api.get<ProductListResponse>(`/products${qs ? `?${qs}` : ""}`);
}

/**
 * 2. POST /products - Thêm sản phẩm mới (PRODUCT_STAFF, ADMIN)
 */
export async function createProduct(
    data: CreateProductPayload
): Promise<Product> {
    return await api.post<Product>("/products", data);
}

/**
 * 3. GET /products/{id} - Chi tiết sản phẩm, kèm tồn kho và đánh giá (Công khai)
 */
export async function getProductById(id: number | string): Promise<Product> {
    return await api.get<Product>(`/products/${id}`);
}

/**
 * 4. PATCH /products/{id} - Chỉnh sửa thông tin sản phẩm (PRODUCT_STAFF, ADMIN)
 */
export async function updateProduct(
    id: number | string,
    data: UpdateProductPayload
): Promise<Product> {
    return await api.patch<Product>(`/products/${id}`, data);
}

/**
 * 5. DELETE /products/{id} - Xóa sản phẩm (Chỉ xóa khi chưa có giao dịch/đơn hàng)
 */
export async function deleteProduct(id: number | string): Promise<unknown> {
    return await api.delete(`/products/${id}`);
}

/**
 * 6. PATCH /products/{id}/discontinue - Ngừng kinh doanh sản phẩm (status -> DISCONTINUED)
 */
export async function discontinueProduct(
    id: number | string
): Promise<Product> {
    return await api.patch<Product>(`/products/${id}/discontinue`);
}

/**
 * 7. PATCH /products/{id}/resume - Mở bán lại sản phẩm (status -> ON_SALE)
 */
export async function resumeProduct(id: number | string): Promise<Product> {
    return await api.patch<Product>(`/products/${id}/resume`);
}

/**
 * 8. POST /products/{id}/image - Upload ảnh sản phẩm (multipart/form-data, max 5MB)
 */
export async function uploadProductImage(
    id: number | string,
    file: File
): Promise<UploadProductImageResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return await api.post<UploadProductImageResponse>(
        `/products/${id}/image`,
        formData
    );
}

/**
 * 9. DELETE /products/{id}/image - Xóa ảnh sản phẩm
 */
export async function deleteProductImage(
    id: number | string
): Promise<unknown> {
    return await api.delete(`/products/${id}/image`);
}

export const productsService = {
    getProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    discontinueProduct,
    resumeProduct,
    uploadProductImage,
    deleteProductImage,
};

export default productsService;
