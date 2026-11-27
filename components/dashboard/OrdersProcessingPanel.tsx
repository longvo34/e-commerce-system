"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { OrderStatus, StaffOrder } from "@/types/order";
import {
  getStaffOrders,
  getStaffOrderById,
  updateOrderStatusByStaff,
  cancelOrderByStaff,
} from "@/services/orders";
import { ORDER_STATUS_MAP, STATUS_THEME, NOTIFICATION_THEME } from "@/constants";
import {
  ClipboardList,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  X,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function OrdersProcessingPanel() {
  const [orders, setOrders] = useState<StaffOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Modal Chi tiết
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOrder, setDetailOrder] = useState<StaffOrder | null>(null);

  // Modal Hủy đơn
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState<StaffOrder | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Fetch danh sách đơn hàng cho Staff
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStaffOrders(
        statusFilter === "ALL" ? undefined : (statusFilter as OrderStatus)
      );
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Không thể tải danh sách đơn hàng";
      showNotification("error", errMsg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Xem chi tiết đơn hàng (GET /orders/{id})
  const handleOpenDetail = async (order: StaffOrder) => {
    setDetailOrder(order);
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const data = await getStaffOrderById(order.id);
      if (data) {
        setDetailOrder(data);
      }
    } catch {
      // Giữ nguyên dữ liệu có sẵn nếu gọi chi tiết lỗi
    } finally {
      setDetailLoading(false);
    }
  };

  // Chuyển trạng thái theo quy trình (PATCH /orders/{id}/status)
  // Quy trình: PENDING -> PREPARING -> SHIPPING -> DELIVERED
  const handleUpdateStatus = async (orderId: number, nextStatus: OrderStatus) => {
    setSubmittingAction(true);
    try {
      await updateOrderStatusByStaff(orderId, nextStatus);
      const nextMeta = ORDER_STATUS_MAP[nextStatus]?.label || nextStatus;
      showNotification("success", `Đã cập nhật đơn #${orderId} sang trạng thái "${nextMeta}"!`);

      // Cập nhật state nếu đang mở modal chi tiết
      if (detailOrder && detailOrder.id === orderId) {
        setDetailOrder((prev) => (prev ? { ...prev, status: nextStatus } : prev));
      }

      fetchOrders();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Chuyển trạng thái đơn hàng thất bại.";
      showNotification("error", errMsg);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Mở modal hủy đơn bởi nhân viên kho
  const handleOpenCancelModal = (order: StaffOrder) => {
    setCancellingOrder(order);
    setCancelReason("");
    setIsCancelModalOpen(true);
  };

  // Xác nhận hủy đơn (POST /orders/{id}/cancel-by-staff)
  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;
    if (!cancelReason.trim()) {
      showNotification("error", "Vui lòng nhập lý do hủy đơn hàng!");
      return;
    }

    setSubmittingAction(true);
    try {
      await cancelOrderByStaff(cancellingOrder.id, cancelReason.trim());
      showNotification(
        "success",
        `Đã hủy đơn hàng #${cancellingOrder.id} và hoàn lại tồn kho thành công!`
      );
      setIsCancelModalOpen(false);
      setCancellingOrder(null);
      setCancelReason("");

      if (detailOrder && detailOrder.id === cancellingOrder.id) {
        setDetailOrder((prev) =>
          prev
            ? { ...prev, status: "CANCELLED", cancelReason: cancelReason.trim() }
            : prev
        );
      }

      fetchOrders();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Hủy đơn hàng thất bại.";
      showNotification("error", errMsg);
    } finally {
      setSubmittingAction(false);
    }
  };

  // Filtered Orders theo từ khóa tìm kiếm
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = searchTerm.toLowerCase();
      const matchId = String(o.id).includes(q);
      const matchCustomer = (o.user?.fullName || (o as any).customerName || "").toLowerCase().includes(q);
      const matchEmail = (o.user?.email || "").toLowerCase().includes(q);
      const matchPhone = (o.user?.phoneNumber || (o as any).phoneNumber || "").toLowerCase().includes(q);
      const matchAddress = (o.shippingAddress || "").toLowerCase().includes(q);
      return matchId || matchCustomer || matchEmail || matchPhone || matchAddress;
    });
  }, [orders, searchTerm]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const preparing = orders.filter((o) => o.status === "PREPARING").length;
    const shipping = orders.filter((o) => o.status === "SHIPPING").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const cancelled = orders.filter((o) => o.status === "CANCELLED").length;
    return { total, pending, preparing, shipping, delivered, cancelled };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all border ${
            NOTIFICATION_THEME[notification.type] || STATUS_THEME.INFO.badgeClass
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Quy trình xử lý đơn hàng (Staff & Admin)
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              Role: INVENTORY_STAFF / ADMIN
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quy trình chuẩn: Tiếp nhận (PENDING) ➔ Đóng gói (PREPARING) ➔ Giao hàng (SHIPPING) ➔ Hoàn thành (DELIVERED).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-muted-foreground">Tổng đơn hàng</span>
          <p className="text-xl font-bold text-foreground mt-0.5">{stats.total}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Chờ tiếp nhận</span>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{stats.pending}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Đang đóng gói</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-0.5">{stats.preparing}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">Đang giao vận</span>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-0.5">{stats.shipping}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Đã giao thành công</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{stats.delivered}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-border bg-card">
          <span className="text-[11px] text-destructive font-medium">Đã hủy & Hoàn kho</span>
          <p className="text-xl font-bold text-destructive mt-0.5">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Tất cả đơn" },
            { id: "PENDING", label: "Chờ tiếp nhận" },
            { id: "PREPARING", label: "Đang đóng gói" },
            { id: "SHIPPING", label: "Đang giao vận" },
            { id: "DELIVERED", label: "Đã giao" },
            { id: "CANCELLED", label: "Đã hủy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Mã đơn</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Địa chỉ giao hàng</th>
                <th className="py-3 px-4 text-right">Tổng tiền</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác quy trình</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    Đang tải danh sách đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Không có đơn hàng nào cần xử lý.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o, idx) => {
                  const statusMeta = ORDER_STATUS_MAP[o.status] || {
                    label: o.status,
                    badgeClass: "bg-muted text-muted-foreground",
                  };
                  const customerName =
                    o.user?.fullName || (o as any).customerName || `Khách hàng #${o.userId || idx + 1}`;
                  const customerEmail = o.user?.email || "";
                  const customerPhone = o.user?.phoneNumber || (o as any).phoneNumber || "";
                  const itemKey = `order-${o.id ?? idx}-${idx}`;

                  return (
                    <tr key={itemKey} className="hover:bg-muted/20 transition-colors">
                      {/* Mã đơn & Thời gian */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold font-mono text-foreground text-xs">
                          #{o.id}
                        </p>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : "—"}
                        </span>
                      </td>

                      {/* Khách hàng */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-foreground">{customerName}</p>
                        {customerPhone && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {customerPhone}
                          </p>
                        )}
                        {customerEmail && (
                          <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                            {customerEmail}
                          </p>
                        )}
                      </td>

                      {/* Địa chỉ giao hàng */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <p className="flex items-start gap-1 text-[11px] max-w-xs truncate" title={o.shippingAddress}>
                          <MapPin className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                          <span>{o.shippingAddress || "—"}</span>
                        </p>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5 inline-block">
                          PTTT: {o.paymentMethod || "COD"}
                        </span>
                      </td>

                      {/* Tổng tiền */}
                      <td className="py-3.5 px-4 text-right">
                        <p className="font-bold text-foreground text-xs">
                          {Number(o.totalAmount || 0).toLocaleString("vi-VN")}₫
                        </p>
                        {Number(o.discountAmount || 0) > 0 && (
                          <span className="text-[10px] text-emerald-600 block">
                            -{(Number(o.discountAmount)).toLocaleString("vi-VN")}₫
                          </span>
                        )}
                      </td>

                      {/* Trạng thái đơn */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusMeta.badgeClass}`}
                        >
                          {statusMeta.label}
                        </span>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {/* Xem chi tiết */}
                          <button
                            onClick={() => handleOpenDetail(o)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Xem chi tiết đơn hàng (GET /orders/{id})"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Bước 1: Tiếp nhận -> Đóng gói */}
                          {o.status === "PENDING" && (
                            <button
                              disabled={submittingAction}
                              onClick={() => handleUpdateStatus(o.id, "PREPARING")}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1"
                              title="Tiếp nhận đơn và tiến hành đóng gói"
                            >
                              <Package className="w-3.5 h-3.5" />
                              <span>Tiếp nhận</span>
                            </button>
                          )}

                          {/* Bước 2: Đang đóng gói -> Bàn giao shipper */}
                          {o.status === "PREPARING" && (
                            <button
                              disabled={submittingAction}
                              onClick={() => handleUpdateStatus(o.id, "SHIPPING")}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-xs flex items-center gap-1"
                              title="Bàn giao bưu tá / đơn vị vận chuyển"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Giao shipper</span>
                            </button>
                          )}

                          {/* Bước 3: Đang giao -> Đã giao */}
                          {o.status === "SHIPPING" && (
                            <button
                              disabled={submittingAction}
                              onClick={() => handleUpdateStatus(o.id, "DELIVERED")}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center gap-1"
                              title="Xác nhận khách đã nhận hàng thành công"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã giao</span>
                            </button>
                          )}

                          {/* Nút hủy đơn (Chỉ cho phép khi chưa giao và chưa hủy) */}
                          {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                            <button
                              disabled={submittingAction}
                              onClick={() => handleOpenCancelModal(o)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-rose-500/20 text-rose-600 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                              title="Hủy đơn hàng & Tự động hoàn lại tồn kho"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Hủy</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: CHI TIẾT ĐƠN HÀNG (GET /orders/{id}) */}
      {isDetailModalOpen && detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  Chi tiết đơn hàng #{detailOrder.id}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Ngày đặt: {detailOrder.createdAt ? new Date(detailOrder.createdAt).toLocaleString("vi-VN") : "—"}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setDetailOrder(null);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                Đang tải chi tiết đơn hàng...
              </div>
            ) : (
              <div className="space-y-4 mt-4 text-xs">
                {/* Trạng thái & Tiến trình quy trình */}
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold border ${
                        ORDER_STATUS_MAP[detailOrder.status]?.badgeClass || "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ORDER_STATUS_MAP[detailOrder.status]?.label || detailOrder.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-muted-foreground">
                    Thanh toán:{" "}
                    <span className="font-semibold text-foreground">
                      {detailOrder.paymentStatus === "PAID"
                        ? "Đã thanh toán"
                        : detailOrder.paymentStatus === "FAILED"
                        ? "Thất bại"
                        : "Chưa thanh toán"}
                    </span>{" "}
                    ({detailOrder.paymentMethod || "COD"})
                  </div>
                </div>

                {/* Lý do hủy nếu có */}
                {detailOrder.status === "CANCELLED" && detailOrder.cancelReason && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Lý do hủy đơn:</p>
                      <p className="text-[11px] mt-0.5">{detailOrder.cancelReason}</p>
                    </div>
                  </div>
                )}

                {/* Thông tin giao nhận */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">Người nhận hàng</span>
                    <p className="font-semibold text-foreground text-xs mt-0.5">
                      {detailOrder.user?.fullName || (detailOrder as any).customerName || "—"}
                    </p>
                    {detailOrder.user?.phoneNumber && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        SĐT: {detailOrder.user.phoneNumber}
                      </p>
                    )}
                    {detailOrder.user?.email && (
                      <p className="text-[11px] text-muted-foreground">{detailOrder.user.email}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">Địa chỉ phát hàng</span>
                    <p className="font-semibold text-foreground text-xs mt-0.5">
                      {detailOrder.shippingAddress || "—"}
                    </p>
                  </div>
                </div>

                {/* Danh sách mặt hàng */}
                <div>
                  <h5 className="font-semibold text-xs text-foreground mb-2">
                    Sản phẩm trong đơn hàng
                  </h5>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-muted/40 border-b border-border text-muted-foreground text-[10px] uppercase font-bold">
                        <tr>
                          <th className="py-2.5 px-3">Sản phẩm</th>
                          <th className="py-2.5 px-3 text-center">Số lượng</th>
                          <th className="py-2.5 px-3 text-right">Đơn giá</th>
                          <th className="py-2.5 px-3 text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {Array.isArray(detailOrder.items || detailOrder.orderDetails) &&
                        (detailOrder.items || detailOrder.orderDetails)!.length > 0 ? (
                          (detailOrder.items || detailOrder.orderDetails)!.map((item, idx) => {
                            const pName =
                              item.product?.productName ||
                              (item as any).productName ||
                              `Sản phẩm #${item.productId}`;
                            const pSku = item.product?.skuCode || (item as any).skuCode || "";
                            const lineTotal = Number(item.unitPrice || 0) * Number(item.quantity || 1);

                            return (
                              <tr key={item.id ?? idx}>
                                <td className="py-2.5 px-3">
                                  <p className="font-semibold text-foreground">{pName}</p>
                                  {pSku && (
                                    <span className="text-[10px] text-muted-foreground font-mono">
                                      SKU: {pSku}
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold">
                                  x{item.quantity}
                                </td>
                                <td className="py-2.5 px-3 text-right text-muted-foreground">
                                  {Number(item.unitPrice || 0).toLocaleString("vi-VN")}₫
                                </td>
                                <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                                  {lineTotal.toLocaleString("vi-VN")}₫
                                </td>
                              </tr>
                            );
                          })
                        ) : detailOrder.orderDetail ? (
                          <tr>
                            <td className="py-2.5 px-3">
                              Sản phẩm #{detailOrder.orderDetail.productId}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold">
                              x{detailOrder.orderDetail.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right text-muted-foreground">
                              {Number(detailOrder.orderDetail.unitPrice || 0).toLocaleString("vi-VN")}₫
                            </td>
                            <td className="py-2.5 px-3 text-right font-semibold text-foreground">
                              {(
                                Number(detailOrder.orderDetail.unitPrice || 0) *
                                Number(detailOrder.orderDetail.quantity || 1)
                              ).toLocaleString("vi-VN")}
                              ₫
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-4 text-center text-muted-foreground">
                              Không có dữ liệu chi tiết mặt hàng.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tổng kết tiền */}
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí vận chuyển:</span>
                    <span>+{Number(detailOrder.shippingFee || 0).toLocaleString("vi-VN")}₫</span>
                  </div>
                  {Number(detailOrder.discountAmount || 0) > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá voucher:</span>
                      <span>-{Number(detailOrder.discountAmount).toLocaleString("vi-VN")}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-foreground text-sm pt-1.5 border-t border-border">
                    <span>Tổng thanh toán:</span>
                    <span className="text-primary">
                      {Number(detailOrder.totalAmount || 0).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>

                {/* Footer buttons chuyển bước */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    {detailOrder.status !== "DELIVERED" && detailOrder.status !== "CANCELLED" && (
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={() => {
                          setIsDetailModalOpen(false);
                          handleOpenCancelModal(detailOrder);
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                      >
                        Hủy đơn & Hoàn kho
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {detailOrder.status === "PENDING" && (
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={() => handleUpdateStatus(detailOrder.id, "PREPARING")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Tiếp nhận đóng gói
                      </button>
                    )}

                    {detailOrder.status === "PREPARING" && (
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={() => handleUpdateStatus(detailOrder.id, "SHIPPING")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Bàn giao shipper
                      </button>
                    )}

                    {detailOrder.status === "SHIPPING" && (
                      <button
                        type="button"
                        disabled={submittingAction}
                        onClick={() => handleUpdateStatus(detailOrder.id, "DELIVERED")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                      >
                        Xác nhận đã giao
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        setDetailOrder(null);
                      }}
                      className="px-4 py-2 text-xs rounded-xl border border-border hover:bg-muted font-semibold"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: HỦY ĐƠN HÀNG BỞI NHÂN VIÊN KHO (POST /orders/{id}/cancel-by-staff) */}
      {isCancelModalOpen && cancellingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-base text-destructive flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                Hủy đơn hàng #{cancellingOrder.id}
              </h4>
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setCancellingOrder(null);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancel} className="space-y-4 mt-4">
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <p className="font-semibold">Lưu ý quan trọng:</p>
                <p className="mt-1">
                  Đơn hàng sau khi hủy sẽ không thể phục hồi. Hệ thống sẽ tự động hoàn lại số lượng tồn kho của các sản phẩm trong đơn.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Lý do hủy đơn hàng <span className="text-destructive">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ví dụ: Khách gọi đổi ý, hết hàng không thể cung ứng, địa chỉ sai..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancellingOrder(null);
                  }}
                  className="px-4 py-2 text-xs rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Không hủy
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="px-4 py-2 text-xs rounded-xl bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 disabled:opacity-50"
                >
                  {submittingAction ? "Đang xử lý..." : "Xác nhận hủy & Hoàn kho"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
