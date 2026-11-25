import { STATUS_THEME } from "./colors";

export const INVENTORY_TRANSACTION_TYPE = {
  IMPORT: "IMPORT",           // Nhập kho
  EXPORT: "EXPORT",           // Xuất kho
  ADJUSTMENT: "ADJUSTMENT",   // Điều chỉnh kiểm kê
} as const;

export type InventoryTransactionTypeKey = keyof typeof INVENTORY_TRANSACTION_TYPE;
export type InventoryTransactionType =
  | (typeof INVENTORY_TRANSACTION_TYPE)[InventoryTransactionTypeKey]
  | string;

export const INVENTORY_TRANSACTION_MAP: Record<
  string,
  {
    label: string;
    badgeClass: string;
    btnClass: string;
    outlineBtnClass: string;
    prefix: string;
    color: string;
  }
> = {
  IMPORT: {
    label: "Nhập kho",
    badgeClass: STATUS_THEME.SUCCESS.badgeClass,
    btnClass: STATUS_THEME.SUCCESS.btnClass,
    outlineBtnClass: STATUS_THEME.SUCCESS.outlineBtnClass,
    prefix: "+",
    color: STATUS_THEME.SUCCESS.color,
  },
  EXPORT: {
    label: "Xuất kho",
    badgeClass: STATUS_THEME.DANGER.badgeClass,
    btnClass: STATUS_THEME.DANGER.btnClass,
    outlineBtnClass: STATUS_THEME.DANGER.outlineBtnClass,
    prefix: "-",
    color: STATUS_THEME.DANGER.color,
  },
  ADJUSTMENT: {
    label: "Điều chỉnh kiểm kê",
    badgeClass: STATUS_THEME.INFO.badgeClass,
    btnClass: STATUS_THEME.INFO.btnClass,
    outlineBtnClass: STATUS_THEME.INFO.outlineBtnClass,
    prefix: "±",
    color: STATUS_THEME.INFO.color,
  },
};
