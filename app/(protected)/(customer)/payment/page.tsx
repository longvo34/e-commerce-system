"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getCart } from "@/services/cart";
import { placeOrder } from "@/services/orders";
import type { PlaceOrderResponse } from "@/types/order";
import { checkVoucher } from "@/services/vouchers";

function subscribeToCheckoutAddress() {
  // Địa chỉ được đọc khi component mount.
  return () => {};
}

function getCheckoutAddress() {
  if (typeof window === "undefined") {
    return "";
  }

  return sessionStorage.getItem("checkoutShippingAddress")?.trim() || "";
}

function getServerCheckoutAddress(): null {
  return null;
}

export default function PaymentPage() {
  const [billingAddressType, setBillingAddressType] = useState<
    "same" | "different"
  >("same");
  const [discountCode, setDiscountCode] = useState("");
  const [checkingVoucher, setCheckingVoucher] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState("");
  const [voucherValid, setVoucherValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "BANK_TRANSFER" | "E_WALLET"
  >("COD");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderResult, setOrderResult] = useState<PlaceOrderResponse | null>(
    null,
  );
  const shippingAddress = useSyncExternalStore(
    subscribeToCheckoutAddress,
    getCheckoutAddress,
    getServerCheckoutAddress,
  );

  const handleCheckVoucher = async () => {
    const code = discountCode.trim();

    if (!code || checkingVoucher) return;

    setCheckingVoucher(true);
    setVoucherMessage("");
    setVoucherValid(false);

    try {
      const result = await checkVoucher(code);

      setVoucherValid(result.valid);

      if (result.valid) {
        setVoucherMessage(
          "Mã Voucher hợp lệ. Chưa áp dụng giảm giá vào đơn hàng.",
        );
      } else {
        setVoucherMessage(result.message || "Mã giảm giá không hợp lệ.");
      }
    } catch (err) {
      setVoucherMessage(
        err instanceof Error ? err.message : "Không thể kiểm tra mã giảm giá.",
      );
    } finally {
      setCheckingVoucher(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (placingOrder || orderResult) return;

    setOrderError("");

    if (!shippingAddress) {
      setOrderError("Vui lòng nhập địa chỉ giao hàng trước khi đặt hàng.");
      return;
    }

    if (paymentMethod !== "COD") {
      setOrderError(
        "Hiện tại chỉ hỗ trợ đặt hàng bằng COD. " +
          "Thanh toán online sẽ được tích hợp sau.",
      );
      return;
    }

    setPlacingOrder(true);

    try {
      // 1. Kiểm tra giỏ hàng trước khi đặt
      const cart = await getCart();

      if (!Array.isArray(cart.items)) {
        throw new Error("Dữ liệu giỏ hàng không hợp lệ.");
      }

      if (cart.items.length === 0) {
        throw new Error("Giỏ hàng đang trống. Vui lòng thêm sản phẩm.");
      }

      // 2. Tạo đơn hàng COD.
      // Chưa gửi voucherCode vì chưa có mã hợp lệ
      // và chưa kiểm chứng response valid: true.
      const result = await placeOrder({
        shippingAddress,
        paymentMethod: "COD",
      });

      // 3. Backend có thể tách giỏ hàng thành nhiều đơn.
      setOrderResult(result);

      // Không redirect đến /order-confirmation vì
      // COD chưa đồng nghĩa với đã thanh toán.
    } catch (err) {
      setOrderError(
        err instanceof Error ? err.message : "Không thể tạo đơn hàng.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const steps = [
    {
      number: 1,
      label: "Thông tin",
      href: "/profile-confirmation",
      completed: true,
    },
    { number: 2, label: "Giao hàng", href: "/shipping", completed: true },
    { number: 3, label: "Thanh toán", active: true },
  ];

  return (
    <div className="w-full bg-background text-foreground py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-7 space-y-6">
            <nav
              aria-label="Tiến trình đặt hàng"
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium mb-2"
            >
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 ${
                      step.active
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                        step.active
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number}
                    </span>
                    {step.href ? (
                      <Link
                        href={step.href}
                        className="hover:text-foreground transition-colors"
                      >
                        {step.label}
                      </Link>
                    ) : (
                      <span>{step.label}</span>
                    )}
                  </div>

                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-1" />
                  )}
                </div>
              ))}
            </nav>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 divide-y divide-border/70 text-sm">
              <div className="pb-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-6 flex-1">
                  <span className="text-xs text-muted-foreground w-16 sm:w-20 flex-shrink-0">
                    Liên hệ
                  </span>
                  <span className="text-xs sm:text-sm text-foreground truncate">
                    user@example.com
                  </span>
                </div>
                <Link
                  href="/profile-confirmation"
                  className="text-xs text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Sửa
                </Link>
              </div>

              <div className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-6 flex-1">
                  <span className="text-xs text-muted-foreground w-16 sm:w-20 flex-shrink-0">
                    Giao đến
                  </span>
                  <span className="text-xs sm:text-sm text-foreground truncate">
                    {shippingAddress === null
                      ? "Đang tải địa chỉ..."
                      : shippingAddress || "Chưa có địa chỉ giao hàng"}
                  </span>
                </div>
                <Link
                  href="/profile-confirmation"
                  className="text-xs text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Sửa
                </Link>
              </div>

              <div className="pt-3.5 flex items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3 sm:gap-6 flex-1">
                  <span className="text-xs text-muted-foreground w-16 sm:w-20 flex-shrink-0">
                    Phương thức
                  </span>
                  <span className="text-xs sm:text-sm text-foreground truncate">
                    Giao hàng tiêu chuẩn · Miễn phí
                  </span>
                </div>
                <Link
                  href="/shipping"
                  className="text-xs text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity flex-shrink-0"
                >
                  Sửa
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {[
                  { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
                  {
                    value: "BANK_TRANSFER",
                    label: "Chuyển khoản ngân hàng (Mô phỏng)",
                  },
                  { value: "E_WALLET", label: "Ví điện tử (Mô phỏng)" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 rounded-xl border border-border p-4 cursor-pointer hover:bg-muted"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() =>
                        setPaymentMethod(
                          method.value as "COD" | "BANK_TRANSFER" | "E_WALLET",
                        )
                      }
                      className="h-4 w-4 accent-primary"
                    />
                    <span className="text-sm font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Thông tin thuế
              </h2>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Mã số thuế (tuỳ chọn)"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <input
                  type="email"
                  placeholder="Email PEC (tuỳ chọn)"
                  className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-foreground mb-3">
                Địa chỉ thanh toán
              </h2>

              <label
                onClick={() => setBillingAddressType("same")}
                className="flex items-center gap-3 cursor-pointer py-1"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    billingAddressType === "same"
                      ? "border-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {billingAddressType === "same" && (
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                  )}
                </span>
                <span className="text-sm font-medium text-foreground">
                  Giống địa chỉ giao hàng
                </span>
              </label>

              <div className="border-t border-border/70" />

              <label
                onClick={() => setBillingAddressType("different")}
                className="flex items-center gap-3 cursor-pointer py-1"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    billingAddressType === "different"
                      ? "border-foreground"
                      : "border-muted-foreground"
                  }`}
                >
                  {billingAddressType === "different" && (
                    <span className="w-2 h-2 rounded-full bg-foreground" />
                  )}
                </span>
                <span className="text-sm font-medium text-foreground">
                  Dùng địa chỉ thanh toán khác
                </span>
              </label>
            </div>
            {orderError && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
              >
                {orderError}
              </div>
            )}

            {orderResult && (
              <div
                role="status"
                className="rounded-lg border border-border bg-card p-4 text-sm space-y-2"
              >
                <p className="font-semibold">
                  {orderResult.message || "Đặt hàng thành công"}
                </p>

                <p>Số đơn hàng đã tạo: {orderResult.orderCount}</p>

                <p>
                  Tổng tiền:{" "}
                  {orderResult.summary.totalAmount.toLocaleString("vi-VN")} ₫
                </p>

                <p className="text-muted-foreground">
                  Đơn COD đã được ghi nhận, chưa thanh toán.
                </p>

                <Link
                  href="/orders"
                  className="inline-block font-medium underline underline-offset-4"
                >
                  Xem đơn hàng của tôi
                </Link>
              </div>
            )}
            <div className="pt-4 flex items-center justify-between gap-4">
              <Link
                href="/shipping"
                className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
              >
                Quay lại giao hàng
              </Link>

              <button
                type="button"
                onClick={() => void handlePlaceOrder()}
                disabled={placingOrder || orderResult !== null}
                className="inline-block rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs text-center disabled:opacity-50"
              >
                {placingOrder
                  ? "Đang đặt hàng..."
                  : orderResult
                    ? "Đã tạo đơn hàng"
                    : "Đặt hàng"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border border-border/40 flex-shrink-0" />
                <div className="flex-1" />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setVoucherMessage("");
                    setVoucherValid(false);
                  }}
                  placeholder="Mã ưu đãi"
                  className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => void handleCheckVoucher()}
                  disabled={checkingVoucher || !discountCode.trim()}
                  className="rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {checkingVoucher ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>
              {voucherMessage && (
                <p
                  role="status"
                  className={`text-sm ${
                    voucherValid ? "text-foreground" : "text-destructive"
                  }`}
                >
                  {voucherMessage}
                </p>
              )}
              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Tạm tính</span>
                  <span className="font-medium text-foreground"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Giao hàng</span>
                  <span className="text-sm font-medium text-foreground">
                    Miễn phí
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-base font-bold text-foreground">
                  Tổng cộng
                </span>
                <span className="text-base font-bold text-foreground"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
