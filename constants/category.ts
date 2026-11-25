import { STATUS_THEME } from "./colors";

export const CATEGORY_STATUS = {
  ACTIVE: "ACTIVE",       // Đang sử dụng
  INACTIVE: "INACTIVE",   // Ngừng sử dụng
} as const;

export type CategoryStatusKey = keyof typeof CATEGORY_STATUS;
export type CategoryStatus = (typeof CATEGORY_STATUS)[CategoryStatusKey] | string;

export const CATEGORY_STATUS_MAP: Record<
  string,
  { label: string; color: string; badgeClass: string; description: string }
> = {
  ACTIVE: {
    label: "Đang sử dụng",
    color: STATUS_THEME.SUCCESS.color,
    badgeClass: STATUS_THEME.SUCCESS.badgeClass,
    description: "Danh mục đang hoạt động và hiển thị cho khách hàng",
  },
  INACTIVE: {
    label: "Ngừng sử dụng",
    color: STATUS_THEME.MUTED.color,
    badgeClass: STATUS_THEME.MUTED.badgeClass,
    description: "Danh mục đã tạm ngừng hoặc ngừng kinh doanh",
  },
};
