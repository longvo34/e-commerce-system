import api from "../api";
import {
  RevenueReportParams,
  OrdersCountByStatus,
  LowStockProduct,
} from "@/types";

// GET /reports/revenue - Doanh thu theo thời gian (chỉ tính đơn DELIVERED)
export async function getRevenue(params?: RevenueReportParams) {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  if (params?.groupBy) searchParams.append("groupBy", params.groupBy);

  const queryString = searchParams.toString();
  return await api.get(`/reports/revenue${queryString ? `?${queryString}` : ""}`);
}

// GET /reports/orders - Số lượng đơn hàng theo từng trạng thái
export async function getOrdersCountByStatus(): Promise<OrdersCountByStatus> {
  return await api.get<OrdersCountByStatus>("/reports/orders");
}

// GET /reports/low-stock - Danh sách sản phẩm sắp hết hàng
export async function getLowStock(threshold: number = 10): Promise<LowStockProduct[]> {
  return await api.get<LowStockProduct[]>(`/reports/low-stock?threshold=${threshold}`);
}

export const reportsService = {
  getRevenue,
  getOrdersCountByStatus,
  getLowStock,
};

export default reportsService;
