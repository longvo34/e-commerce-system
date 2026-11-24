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
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Sản phẩm hiển thị công khai trên website bán lẻ",
  },
  DISCONTINUED: {
    label: "Ngừng kinh doanh",
    color: "#ef4444",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Sản phẩm tạm khóa hoặc ngưng kinh doanh",
  },
};
