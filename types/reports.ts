// Tham số truyền vào khi lấy báo cáo doanh thu (GET /reports/revenue)
export interface RevenueReportParams {
  from?: string; // ISO 8601 YYYY-MM-DD
  to?: string;   // ISO 8601 YYYY-MM-DD
  groupBy?: "day" | "month";
}

// Điểm dữ liệu doanh thu
export interface RevenueDataPoint {
  date?: string;
  period?: string;
  revenue?: number;
  totalRevenue?: number;
  orderCount?: number;
  [key: string]: unknown;
}

// Số lượng đơn hàng theo từng trạng thái (GET /reports/orders)
export interface OrdersCountByStatus {
  PENDING?: number;
  PREPARING?: number;
  SHIPPING?: number;
  DELIVERED?: number;
  CANCELLED?: number;
  [key: string]: number | undefined;
}

// Sản phẩm sắp hết hàng (GET /reports/low-stock)
export interface LowStockProduct {
  id: number | string;
  name?: string;
  sku?: string;
  stock?: number;
  quantity?: number;
  price?: number;
  category?: string;
  status?: string;
  [key: string]: unknown;
}
