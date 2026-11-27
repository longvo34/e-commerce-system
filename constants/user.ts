import { STATUS_THEME } from "./colors";

export const USER_ROLE_MAP = {
  ADMIN: {
    label: "Quản trị viên (Admin)",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    color: "#a855f7",
  },
  PRODUCT_STAFF: {
    label: "Nhân viên Sản phẩm",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    color: "#3b82f6",
  },
  INVENTORY_STAFF: {
    label: "Nhân viên Kho",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    color: "#f59e0b",
  },
  CUSTOMER: {
    label: "Khách hàng",
    badgeClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    color: "#64748b",
  },
} as const;

export const USER_STATUS_MAP = {
  ACTIVE: {
    label: "Đang hoạt động",
    badgeClass: STATUS_THEME.SUCCESS.badgeClass,
  },
  LOCKED: {
    label: "Đã khóa",
    badgeClass: STATUS_THEME.DANGER.badgeClass,
  },
} as const;
