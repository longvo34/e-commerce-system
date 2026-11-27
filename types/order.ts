export type OrderStatus =
  | "PENDING"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentMethod = "COD" | "BANK_TRANSFER" | "E_WALLET";

export type PaymentStatus = "UNPAID" | "PAID" | "FAILED";

// POST /orders
export interface CreateOrderPayload {
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  voucherCode?: string;
}

// POST /orders/{id}/cancel
export interface CancelOrderPayload {
  reason: string;
}

// POST /orders/{id}/payment-callback
export interface PaymentCallbackPayload {
  success: boolean;
}

// Chi tiết một sản phẩm thuộc đơn hàng
export interface OrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

// Các trường đã xuất hiện trong response mẫu POST /orders
export interface Order {
  id: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus | string;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  orderDetail: OrderDetail;

  // Cần xác minh thêm bằng response thực tế
  shippingAddress?: string;
  paymentMethod?: PaymentMethod;
  cancelReason?: string | null;
  createdAt?: string;
  updatedAt?: string;

  [key: string]: unknown;
}

// Tổng hợp nhiều đơn khi checkout
export interface OrderCheckoutSummary {
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalShippingFee: number;
  totalAmount: number;
}

export interface PlaceOrderResponse {
  message: string;
  orderCount: number;
  orders: Order[];
  summary: OrderCheckoutSummary;
}

// GET /orders/my
// Swagger chưa công bố schema response 200.
// Chưa xác định response là Order[] hay object phân trang.

// GET /orders/my/{id}
// Chưa xác nhận cấu trúc response thành công.
