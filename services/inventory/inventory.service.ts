import api from "../api";
import {
  InventoryStock,
  ImportInventoryPayload,
  ExportInventoryPayload,
  AdjustInventoryPayload,
  InventoryHistoryParams,
  InventoryHistoryItem,
} from "@/types";

/**
 * 1. GET /inventory/stock - Xem tồn kho của tất cả sản phẩm
 * Quyền: INVENTORY_STAFF, ADMIN
 * Công thức: Tồn kho = Tổng IMPORT - Tổng EXPORT + Tổng ADJUSTMENT
 */
export async function getAllStock(): Promise<InventoryStock[]> {
  return await api.get<InventoryStock[]>("/inventory/stock");
}

/**
 * 2. GET /inventory/stock/{productId} - Xem tồn kho của một sản phẩm
 * Quyền: INVENTORY_STAFF, ADMIN
 */
export async function getStockByProductId(
  productId: number | string
): Promise<InventoryStock> {
  return await api.get<InventoryStock>(`/inventory/stock/${productId}`);
}

/**
 * 3. POST /inventory/import - Ghi nhận nhập kho (tăng tồn kho)
 * Quyền: INVENTORY_STAFF, ADMIN
 * @param data { productId, quantity, reason }
 */
export async function importInventory(
  data: ImportInventoryPayload
): Promise<unknown> {
  return await api.post("/inventory/import", data);
}

/**
 * 4. POST /inventory/export - Ghi nhận xuất kho (giảm tồn kho, không được xuất vượt quá tồn kho hiện có)
 * Quyền: INVENTORY_STAFF, ADMIN
 * @param data { productId, quantity, reason }
 */
export async function exportInventory(
  data: ExportInventoryPayload
): Promise<unknown> {
  return await api.post("/inventory/export", data);
}

/**
 * 5. POST /inventory/adjust - Điều chỉnh tồn kho sau kiểm kê
 * Quyền: INVENTORY_STAFF, ADMIN
 * Gửi số lượng thực tế đếm được, hệ thống tự ghi bút toán ADJUSTMENT cho phần lệch
 * @param data { productId, actualQuantity, reason }
 */
export async function adjustInventory(
  data: AdjustInventoryPayload
): Promise<unknown> {
  return await api.post("/inventory/adjust", data);
}

/**
 * 6. GET /inventory/history - Lịch sử giao dịch kho
 * Quyền: INVENTORY_STAFF, ADMIN
 * @param params { productId, type, staffId, from, to }
 */
export async function getInventoryHistory(
  params?: InventoryHistoryParams
): Promise<InventoryHistoryItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.productId) searchParams.append("productId", String(params.productId));
  if (params?.type) searchParams.append("type", params.type);
  if (params?.staffId) searchParams.append("staffId", String(params.staffId));
  if (params?.from) searchParams.append("from", params.from);
  if (params?.to) searchParams.append("to", params.to);
  if (params?.page) searchParams.append("page", String(params.page));
  if (params?.limit) searchParams.append("limit", String(params.limit));

  const qs = searchParams.toString();
  return await api.get<InventoryHistoryItem[]>(`/inventory/history${qs ? `?${qs}` : ""}`);
}

export const inventoryService = {
  getAllStock,
  getStockByProductId,
  importInventory,
  exportInventory,
  adjustInventory,
  getInventoryHistory,
};

export default inventoryService;
