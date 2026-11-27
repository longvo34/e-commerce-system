import api from "../api";
import type {
  VoucherItem,
  VoucherStatus,
  CreateVoucherPayload,
  UpdateVoucherPayload,
  VoucherCheckResponse,
} from "@/types/voucher";

/**
 * [Admin] GET /vouchers
 * Lấy danh sách mã giảm giá. Có thể lọc theo status: ACTIVE | INACTIVE.
 */
export function getVouchers(status?: VoucherStatus): Promise<VoucherItem[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api.get<VoucherItem[]>(`/vouchers${query}`);
}

/**
 * [Admin] POST /vouchers
 * Tạo mã giảm giá mới.
 */
export function createVoucher(
  payload: CreateVoucherPayload
): Promise<VoucherItem> {
  return api.post<VoucherItem>("/vouchers", payload);
}

/**
 * [Admin] GET /vouchers/{id}
 * Xem chi tiết mã giảm giá theo ID.
 */
export function getVoucherById(id: number): Promise<VoucherItem> {
  return api.get<VoucherItem>(`/vouchers/${id}`);
}

/**
 * [Admin] PATCH /vouchers/{id}
 * Chỉnh sửa thông tin mã giảm giá.
 */
export function updateVoucher(
  id: number,
  payload: UpdateVoucherPayload
): Promise<VoucherItem> {
  return api.patch<VoucherItem>(`/vouchers/${id}`, payload);
}

/**
 * [Admin] PATCH /vouchers/{id}/activate
 * Bật kích hoạt mã giảm giá.
 */
export function activateVoucher(id: number): Promise<VoucherItem> {
  return api.patch<VoucherItem>(`/vouchers/${id}/activate`);
}

/**
 * [Admin] PATCH /vouchers/{id}/deactivate
 * Tắt (vô hiệu hóa) mã giảm giá.
 */
export function deactivateVoucher(id: number): Promise<VoucherItem> {
  return api.patch<VoucherItem>(`/vouchers/${id}/deactivate`);
}

/**
 * [Public/Customer] GET /vouchers/check/{code}
 * Kiểm tra mã giảm giá khi đặt hàng.
 */
export function checkVoucher(code: string): Promise<VoucherCheckResponse> {
  return api.get<VoucherCheckResponse>(
    `/vouchers/check/${encodeURIComponent(code)}`
  );
}
