import api from "../api";
import type {
  CreateOrderPayload,
  PlaceOrderResponse,
  CancelOrderPayload,
  PaymentCallbackPayload,
  OrderStatus,
  StaffOrder,
  CustomerOrder,
} from "@/types/order";

// 1. POST /orders - Đặt hàng từ giỏ hàng
export function placeOrder(
  data: CreateOrderPayload,
): Promise<PlaceOrderResponse> {
  return api.post<PlaceOrderResponse>("/orders", data);
}

// GET /orders/my - Danh sách đơn hàng của Customer
// Backend xác nhận response là một mảng.
// Schema từng phần tử chưa được kiểm chứng.
export function getMyOrders(status?: OrderStatus): Promise<CustomerOrder[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return api.get<CustomerOrder[]>(`/orders/my${query}`);
}

// 3. GET /orders/my/{id} - Chi tiết đơn hàng
export function getMyOrderById(id: number): Promise<CustomerOrder> {
  return api.get<CustomerOrder>(`/orders/my/${id}`);
}

// 4. POST /orders/{id}/cancel - Hủy đơn
export function cancelMyOrder(
  id: number,
  data: CancelOrderPayload,
): Promise<unknown> {
  return api.post<unknown>(`/orders/${id}/cancel`, data);
}

// 5. POST /orders/{id}/payment-callback
// Chỉ dùng để giả lập kết quả thanh toán online.
// KHÔNG phải xác nhận giao dịch ngân hàng thật.
export function simulatePaymentCallback(
  id: number,
  data: PaymentCallbackPayload,
): Promise<unknown> {
  return api.post<unknown>(`/orders/${id}/payment-callback`, data);
}

// =========================================================================
// STAFF & ADMIN ENDPOINTS
// =========================================================================

/**
 * 6. GET /orders - [Staff] Danh sách đơn hàng cần xử lý
 * Quyền: INVENTORY_STAFF, ADMIN
 * Query param: status (PENDING, PREPARING, SHIPPING, DELIVERED, CANCELLED)
 */
export function getStaffOrders(status?: OrderStatus): Promise<StaffOrder[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return api.get<StaffOrder[]>(`/orders${query}`);
}

/**
 * 7. GET /orders/{id} - [Staff] Chi tiết đơn hàng
 * Quyền: INVENTORY_STAFF, ADMIN
 */
export function getStaffOrderById(id: number | string): Promise<StaffOrder> {
  return api.get<StaffOrder>(`/orders/${id}`);
}

/**
 * 8. PATCH /orders/{id}/status - [Staff] Cập nhật trạng thái đơn hàng
 * Quyền: INVENTORY_STAFF (hoặc ADMIN)
 * Quy trình: PENDING -> PREPARING -> SHIPPING -> DELIVERED (không được nhảy bước)
 */
export function updateOrderStatusByStaff(
  id: number | string,
  status: OrderStatus,
): Promise<StaffOrder> {
  return api.patch<StaffOrder>(`/orders/${id}/status`, { status });
}

/**
 * 9. POST /orders/{id}/cancel-by-staff - [Staff] Nhân viên kho hủy đơn
 * Quyền: INVENTORY_STAFF (hoặc ADMIN)
 * Dùng khi không thể giao hàng. Tồn kho được hoàn lại.
 */
export function cancelOrderByStaff(
  id: number | string,
  reason: string,
): Promise<StaffOrder> {
  return api.post<StaffOrder>(`/orders/${id}/cancel-by-staff`, { reason });
}
