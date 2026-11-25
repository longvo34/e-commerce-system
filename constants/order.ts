import { STATUS_THEME } from "./colors";

export const ORDER_STATUS = {
  PENDING: "PENDING",       // Chờ tiếp nhận
  PREPARING: "PREPARING",   // Đang đóng gói / chuẩn bị hàng
  SHIPPING: "SHIPPING",     // Đang giao vận
  DELIVERED: "DELIVERED",   // Đã giao thành công
  CANCELLED: "CANCELLED",   // Đã hủy / hoàn kho
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;

// Cấu hình nhãn tiếng Việt, màu sắc badge và mô tả cho từng trạng thái đơn hàng
export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string; badgeClass: string; description: string }
> = {
  PENDING: {
    label: "Chờ tiếp nhận",
    color: STATUS_THEME.WARNING.color,
    badgeClass: STATUS_THEME.WARNING.badgeClass,
    description: "Khách vừa đặt, cần nhân viên kho tiếp nhận xử lý",
  },
  PREPARING: {
    label: "Đang đóng gói",
    color: STATUS_THEME.INFO.color,
    badgeClass: STATUS_THEME.INFO.badgeClass,
    description: "Nhân viên kho đang xuất hàng và đóng gói",
  },
  SHIPPING: {
    label: "Đang giao vận",
    color: STATUS_THEME.PURPLE.color,
    badgeClass: STATUS_THEME.PURPLE.badgeClass,
    description: "Đơn vị vận chuyển đang phát hàng đến khách",
  },
  DELIVERED: {
    label: "Đã giao thành công",
    color: STATUS_THEME.SUCCESS.color,
    badgeClass: STATUS_THEME.SUCCESS.badgeClass,
    description: "Khách đã nhận hàng, tính vào doanh thu thực tế",
  },
  CANCELLED: {
    label: "Đã hủy & Hoàn kho",
    color: STATUS_THEME.DANGER.color,
    badgeClass: STATUS_THEME.DANGER.badgeClass,
    description: "Đơn bị hủy, hệ thống tự động hoàn lại tồn kho",
  },
};
