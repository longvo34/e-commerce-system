import { STATUS_THEME } from "./colors";

export const PRODUCT_STATUS = {
  ON_SALE: "ON_SALE",           // Đang bán
  DISCONTINUED: "DISCONTINUED", // Ngừng kinh doanh
} as const;

export type ProductStatusKey = keyof typeof PRODUCT_STATUS;

export const PRODUCT_STATUS_MAP: Record<
  string,
  { label: string; color: string; badgeClass: string; description: string }
> = {
  ON_SALE: {
    label: "Đang mở bán",
    color: STATUS_THEME.SUCCESS.color,
    badgeClass: STATUS_THEME.SUCCESS.badgeClass,
    description: "Sản phẩm hiển thị công khai trên website bán lẻ",
  },
  DISCONTINUED: {
    label: "Ngừng kinh doanh",
    color: STATUS_THEME.DANGER.color,
    badgeClass: STATUS_THEME.DANGER.badgeClass,
    description: "Sản phẩm tạm khóa hoặc ngưng kinh doanh",
  },
};
