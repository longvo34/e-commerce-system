/**
 * Bảng màu trạng thái tập trung cho toàn bộ hệ thống Dashboard
 * Giữ nguyên 100% màu sắc hiện tại của giao diện.
 * Khi cần thay đổi bất kỳ màu nào (Hex, Badge, Nút bấm, Viền),
 * chỉ cần sửa tại file này, toàn bộ hệ thống sẽ tự động đồng bộ.
 */

export const STATUS_THEME = {
  // 1. Thành công / Hoạt động / Đang bán / Nhập kho (Xanh lá Emerald)
  SUCCESS: {
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white",
    outlineBtnClass: "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-500/10",
    dotColor: "bg-emerald-500",
  },

  // 2. Nguy hiểm / Đã hủy / Ngừng kinh doanh / Xuất kho / Lỗi / Xóa (Đỏ Rose)
  DANGER: {
    color: "#ef4444",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    btnClass: "bg-rose-600 hover:bg-rose-700 text-white",
    outlineBtnClass: "border-rose-500/30 text-rose-600 hover:bg-rose-500/10",
    textColor: "text-rose-600 dark:text-rose-400",
    bgColor: "bg-rose-500/10",
    dotColor: "bg-rose-500",
  },

  // 3. Cảnh báo / Chờ tiếp nhận / Chờ duyệt / Tồn kho thấp (Vàng Amber)
  WARNING: {
    color: "#f59e0b",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    btnClass: "bg-amber-600 hover:bg-amber-700 text-white",
    outlineBtnClass: "border-amber-500/30 text-amber-600 hover:bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-500/10",
    dotColor: "bg-amber-500",
  },

  // 4. Thông tin / Đang đóng gói / Điều chỉnh kiểm kê / Chỉnh sửa (Xanh dương Blue)
  INFO: {
    color: "#3b82f6",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white",
    outlineBtnClass: "border-blue-500/30 text-blue-600 hover:bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-500/10",
    dotColor: "bg-blue-500",
  },

  // 5. Đang vận chuyển / Giao hàng (Tím Purple)
  PURPLE: {
    color: "#8b5cf6",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    btnClass: "bg-purple-600 hover:bg-purple-700 text-white",
    outlineBtnClass: "border-purple-500/30 text-purple-600 hover:bg-purple-500/10",
    textColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-500/10",
    dotColor: "bg-purple-500",
  },

  // 6. Tạm ngừng / Vô hiệu / Chưa hoạt động (Xám Muted)
  MUTED: {
    color: "#6b7280",
    badgeClass: "bg-muted text-muted-foreground border-border",
    btnClass: "bg-muted text-muted-foreground hover:bg-muted/80",
    outlineBtnClass: "border-border text-muted-foreground hover:bg-muted",
    textColor: "text-muted-foreground",
    bgColor: "bg-muted",
    dotColor: "bg-muted-foreground",
  },
} as const;

export type StatusThemeKey = keyof typeof STATUS_THEME;

// Helper cho các Notification Banners
export const NOTIFICATION_THEME = {
  success: STATUS_THEME.SUCCESS.badgeClass,
  error: STATUS_THEME.DANGER.badgeClass,
  info: STATUS_THEME.INFO.badgeClass,
  warning: STATUS_THEME.WARNING.badgeClass,
} as const;
