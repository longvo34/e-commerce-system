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
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Danh mục đang hoạt động và hiển thị cho khách hàng",
  },
  INACTIVE: {
    label: "Ngừng sử dụng",
    color: "#6b7280",
    badgeClass: "bg-muted text-muted-foreground border-border",
    description: "Danh mục đã tạm ngừng hoặc ngừng kinh doanh",
  },
};
