import { InventoryTransactionType } from "@/constants/inventory";

export type { InventoryTransactionType };

// 1. Dữ liệu tồn kho từng sản phẩm
export interface InventoryStock {
  productId: number;
  productName?: string;
  skuCode?: string;
  stock: number;
  totalImport?: number;
  totalExport?: number;
  totalAdjustment?: number;
  updatedAt?: string;
  [key: string]: unknown;
}

// 2. Payload nhập kho (POST /inventory/import)
export interface ImportInventoryPayload {
  productId: number;
  quantity: number;
  reason: string;
}

// 3. Payload xuất kho (POST /inventory/export)
export interface ExportInventoryPayload {
  productId: number;
  quantity: number;
  reason: string;
}

// 4. Payload điều chỉnh kiểm kê (POST /inventory/adjust)
export interface AdjustInventoryPayload {
  productId: number;
  actualQuantity: number;
  reason: string;
}

// 5. Tham số lọc lịch sử giao dịch kho (GET /inventory/history)
export interface InventoryHistoryParams {
  productId?: number | string;
  type?: InventoryTransactionType;
  staffId?: number | string;
  from?: string; // YYYY-MM-DD hoặc ISO 8601
  to?: string;   // YYYY-MM-DD hoặc ISO 8601
  page?: number;
  limit?: number;
}

// 6. Bản ghi lịch sử giao dịch kho
export interface InventoryHistoryItem {
  id: number | string;
  productId: number;
  productName?: string;
  skuCode?: string;
  type: InventoryTransactionType;
  quantity: number;
  actualQuantity?: number;
  reason: string;
  staffId?: number;
  staffName?: string;
  createdAt: string;
  [key: string]: unknown;
}
