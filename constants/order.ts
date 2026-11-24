export const ORDER_STATUS = {
  PENDING: "PENDING",       // Chờ tiếp nhận
  PREPARING: "PREPARING",   // Đang đóng gói / chuẩn bị hàng
  SHIPPING: "SHIPPING",     // Đang giao vận
  DELIVERED: "DELIVERED",   // Đã giao thành công
  CANCELLED: "CANCELLED",   // Đã hủy / hoàn kho
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string; badgeClass: string; description: string }
> = {
  PENDING: {
    label: "Chờ tiếp nhận",
    color: "#f59e0b",
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    description: "Khách vừa đặt, cần nhân viên kho tiếp nhận xử lý",
  },
  PREPARING: {
    label: "Đang đóng gói",
    color: "#3b82f6",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    description: "Nhân viên kho đang xuất hàng và đóng gói",
  },
  SHIPPING: {
    label: "Đang giao vận",
    color: "#8b5cf6",
    badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    description: "Đơn vị vận chuyển đang phát hàng đến khách",
  },
  DELIVERED: {
    label: "Đã giao thành công",
    color: "#10b981",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    description: "Khách đã nhận hàng, tính vào doanh thu thực tế",
  },
  CANCELLED: {
    label: "Đã hủy & Hoàn kho",
    color: "#ef4444",
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    description: "Đơn bị hủy, hệ thống tự động hoàn lại tồn kho",
  },
};
