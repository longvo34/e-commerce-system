import api from "../api";
import type {
  CreateOrderPayload,
  PlaceOrderResponse,
  CancelOrderPayload,
  PaymentCallbackPayload,
  OrderStatus,
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
export function getMyOrders(status?: OrderStatus): Promise<unknown[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";

  return api.get<unknown[]>(`/orders/my${query}`);
}

// 3. GET /orders/my/{id} - Chi tiết đơn hàng
export function getMyOrderById(id: number): Promise<unknown> {
  return api.get<unknown>(`/orders/my/${id}`);
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
