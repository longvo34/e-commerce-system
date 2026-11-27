"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  VoucherItem,
  VoucherStatus,
  CreateVoucherPayload,
  UpdateVoucherPayload,
} from "@/types/voucher";
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  activateVoucher,
  deactivateVoucher,
} from "@/services/vouchers";
import { STATUS_THEME, NOTIFICATION_THEME } from "@/constants";
import {
  TicketPercent,
  Plus,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  X,
  Edit2,
  Power,
  Tag,
} from "lucide-react";

export default function VouchersManagementPanel() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingVoucherId, setEditingVoucherId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    discountValue: "",
    conditions: "",
    validFrom: "",
    validTo: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Fetch danh sách voucher
  const fetchVouchers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVouchers(
        statusFilter === "ALL" ? undefined : (statusFilter as VoucherStatus)
      );
      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể tải danh sách mã giảm giá";
      showNotification("error", msg);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  // Lọc theo search term
  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const term = searchTerm.toLowerCase();
      const codeMatch = v.code?.toLowerCase().includes(term);
      const condMatch = v.conditions?.toLowerCase().includes(term);
      return codeMatch || condMatch;
    });
  }, [vouchers, searchTerm]);

  // Mở modal tạo mới
  const handleOpenCreate = () => {
    const now = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(now.getMonth() + 1);

    setFormData({
      code: "",
      discountValue: "",
      conditions: "",
      validFrom: now.toISOString().slice(0, 16),
      validTo: nextMonth.toISOString().slice(0, 16),
    });
    setModalMode("create");
    setEditingVoucherId(null);
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEdit = (v: VoucherItem) => {
    setFormData({
      code: v.code,
      discountValue: String(v.discountValue),
      conditions: v.conditions || "",
      validFrom: v.validFrom ? new Date(v.validFrom).toISOString().slice(0, 16) : "",
      validTo: v.validTo ? new Date(v.validTo).toISOString().slice(0, 16) : "",
    });
    setModalMode("edit");
    setEditingVoucherId(v.id);
    setIsModalOpen(true);
  };

  // Submit Modal (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      showNotification("error", "Vui lòng nhập mã giảm giá (Code)");
      return;
    }
    const val = Number(formData.discountValue);
    if (isNaN(val) || val <= 0) {
      showNotification("error", "Giá trị giảm phải là số lớn hơn 0");
      return;
    }
    if (!formData.validFrom || !formData.validTo) {
      showNotification("error", "Vui lòng chọn thời gian hiệu lực");
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        const payload: CreateVoucherPayload = {
          code: formData.code.trim().toUpperCase(),
          discountValue: val,
          conditions: formData.conditions.trim() || undefined,
          validFrom: new Date(formData.validFrom).toISOString(),
          validTo: new Date(formData.validTo).toISOString(),
        };
        await createVoucher(payload);
        showNotification("success", `Tạo mã giảm giá ${payload.code} thành công!`);
      } else if (modalMode === "edit" && editingVoucherId) {
        const payload: UpdateVoucherPayload = {
          code: formData.code.trim().toUpperCase(),
          discountValue: val,
          conditions: formData.conditions.trim() || undefined,
          validFrom: new Date(formData.validFrom).toISOString(),
          validTo: new Date(formData.validTo).toISOString(),
        };
        await updateVoucher(editingVoucherId, payload);
        showNotification("success", `Cập nhật mã giảm giá thành công!`);
      }

      setIsModalOpen(false);
      fetchVouchers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Thao tác thất bại, vui lòng thử lại!";
      showNotification("error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Bật / Tắt Voucher
  const handleToggleStatus = async (v: VoucherItem) => {
    setActionLoadingId(v.id);
    try {
      if (v.status === "ACTIVE") {
        await deactivateVoucher(v.id);
        showNotification("info", `Đã tắt mã giảm giá ${v.code}`);
      } else {
        await activateVoucher(v.id);
        showNotification("success", `Đã bật kích hoạt mã giảm giá ${v.code}`);
      }
      fetchVouchers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể thay đổi trạng thái mã giảm giá";
      showNotification("error", msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "—";
    try {
      return new Date(isoStr).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2 p-3.5 rounded-xl border text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
            notification.type === "success"
              ? NOTIFICATION_THEME.success
              : notification.type === "error"
              ? NOTIFICATION_THEME.error
              : NOTIFICATION_THEME.info
          }`}
        >
          {notification.type === "success" && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
          {notification.type === "error" && <XCircle className="w-4 h-4 flex-shrink-0" />}
          {notification.type === "info" && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <TicketPercent className="w-5 h-5 text-primary" />
            Chương trình giảm giá & Mã khuyến mãi (Admin)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý mã voucher, mức giảm, điều kiện áp dụng và thời hạn hiệu lực.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchVouchers}
            disabled={loading}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo mã giảm giá</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border w-fit">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "ACTIVE", label: "Đang bật" },
            { id: "INACTIVE", label: "Đang tắt" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                statusFilter === tab.id
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã hoặc điều kiện..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Grid danh sách Voucher */}
      {loading ? (
        <div className="py-20 text-center text-muted-foreground">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
          Đang tải danh sách mã giảm giá...
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card/50">
          <Tag className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">
            {searchTerm
              ? "Không tìm thấy mã giảm giá phù hợp với từ khóa."
              : "Chưa có chương trình giảm giá nào trong hệ thống."}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Nhấn &ldquo;+ Tạo mã giảm giá&rdquo; để thêm mã mới.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVouchers.map((v) => {
            const isActive = v.status === "ACTIVE";
            const isLoadingAction = actionLoadingId === v.id;

            return (
              <div
                key={v.id}
                className="rounded-2xl border border-border bg-card p-5 space-y-3.5 flex flex-col justify-between shadow-xs hover:border-border/80 transition-all"
              >
                <div>
                  {/* Top: Code & Status Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-sm px-3 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border tracking-wider">
                      {v.code}
                    </span>
                    <span
                      className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold border ${
                        isActive
                          ? STATUS_THEME.SUCCESS.badgeClass
                          : STATUS_THEME.DANGER.badgeClass
                      }`}
                    >
                      {isActive ? "Đang bật" : "Đã tắt"}
                    </span>
                  </div>

                  {/* Giá trị giảm */}
                  <div className="mt-3">
                    <p className="text-lg font-bold text-foreground">
                      Giảm {v.discountValue?.toLocaleString("vi-VN")}₫
                    </p>
                    {v.conditions && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        Điều kiện: {v.conditions}
                      </p>
                    )}
                  </div>

                  {/* Thời gian hiệu lực */}
                  <div className="mt-3 pt-3 border-t border-border/60 text-[11px] text-muted-foreground space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>Từ: {formatDate(v.validFrom)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-5">
                      <span>Đến: {formatDate(v.validTo)}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <button
                    onClick={() => handleToggleStatus(v)}
                    disabled={isLoadingAction}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      isActive
                        ? STATUS_THEME.DANGER.outlineBtnClass
                        : STATUS_THEME.SUCCESS.outlineBtnClass
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isLoadingAction ? "Đang xử lý..." : isActive ? "Tắt mã" : "Bật mã"}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TẠO / SỬA VOUCHER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
            onClick={() => !submitting && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <TicketPercent className="w-4 h-4 text-primary" />
                {modalMode === "create" ? "Tạo mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
              </h4>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Mã voucher (Code) <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SALE50K, BLACKFRIDAY"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs font-mono font-bold text-foreground uppercase placeholder:normal-case placeholder:font-normal focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Số tiền giảm (VNĐ) <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={1000}
                  placeholder="Ví dụ: 50000"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Điều kiện áp dụng
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Áp dụng cho đơn từ 500.000đ"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Bắt đầu hiệu lực <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Hết hạn hiệu lực <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalMode === "create" ? "Tạo mã" : "Lưu thay đổi"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
