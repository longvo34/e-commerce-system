"use client";

import { useState, useEffect } from "react";
import { getShippingFee, updateShippingFee } from "@/services/settings";
import { NOTIFICATION_THEME } from "@/constants";
import {
  Truck,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Coins,
} from "lucide-react";

export default function ShippingConfigPanel() {
  const [shippingFee, setShippingFee] = useState<string>("");
  const [currentFee, setCurrentFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const fetchFee = async () => {
    setLoading(true);
    try {
      const data = await getShippingFee();
      if (typeof data?.shippingFee === "number") {
        setCurrentFee(data.shippingFee);
        setShippingFee(String(data.shippingFee));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Không thể tải cấu hình phí vận chuyển";
      showNotification("error", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFee();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(shippingFee);

    if (isNaN(val) || val < 0) {
      showNotification("error", "Phí vận chuyển phải là số không âm (>= 0)");
      return;
    }

    setSaving(true);
    try {
      const res = await updateShippingFee({ shippingFee: val });
      if (typeof res?.shippingFee === "number") {
        setCurrentFee(res.shippingFee);
        setShippingFee(String(res.shippingFee));
      }
      showNotification("success", `Đã cập nhật phí vận chuyển thành công: ${val.toLocaleString("vi-VN")}₫`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Cập nhật phí vận chuyển thất bại!";
      showNotification("error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-primary" />
            Cấu hình biểu phí vận chuyển (Admin)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Thiết lập phí giao hàng mặc định được áp dụng khi khách hàng thanh toán đơn hàng.
          </p>
        </div>

        <button
          onClick={fetchFee}
          disabled={loading}
          className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          title="Tải lại biểu phí"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
        </button>
      </div>

      {/* Card cấu hình */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
            Đang tải thông tin phí vận chuyển...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Box hiển thị phí hiện tại */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Biểu phí đang áp dụng hiện tại</p>
                  <p className="text-lg font-bold text-foreground">
                    {currentFee !== null ? `${currentFee.toLocaleString("vi-VN")}₫` : "Chưa cấu hình"}
                  </p>
                </div>
              </div>
            </div>

            {/* Input cập nhật */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Phí giao hàng tiêu chuẩn mới (VNĐ) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={1000}
                  required
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  placeholder="Ví dụ: 30000"
                  className="w-full rounded-xl border border-input bg-background pl-4 pr-12 py-2.5 text-sm text-foreground focus:ring-1 focus:ring-ring"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  ₫
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Lưu ý: Phí vận chuyển phải là số không âm. Đặt là 0 nếu miễn phí vận chuyển toàn bộ cửa hàng.
              </p>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-xs font-semibold hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Đang lưu..." : "Lưu cấu hình phí vận chuyển"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
