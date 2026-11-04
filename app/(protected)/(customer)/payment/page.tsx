"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, CreditCard, Lock, Info } from "lucide-react";

export default function PaymentPage() {
    const [billingAddressType, setBillingAddressType] = useState<"same" | "different">("same");
    const [discountCode, setDiscountCode] = useState("");

    const steps = [
        { number: 1, label: "Thông tin", href: "/profile-confirmation", completed: true },
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
                                        className={`flex items-center gap-1.5 ${step.active
                                            ? "text-foreground font-semibold"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        <span
                                            className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${step.active
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
                                        123 Đường ABC, Quận 1, TP. Hồ Chí Minh
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

                                <div className="bg-muted/70 rounded-xl p-3.5 flex items-center gap-3 text-sm font-semibold text-foreground">
                                    <CreditCard className="w-5 h-5 text-foreground stroke-[1.75]" />
                                    <span>Thẻ tín dụng</span>
                                </div>


                                <div className="space-y-3 pt-1">

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Số thẻ"
                                            className="w-full rounded-lg border border-input bg-background pl-3.5 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        />
                                        <Lock className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>


                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Tên chủ thẻ"
                                            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        />
                                    </div>


                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="text"
                                            placeholder="Hết hạn (tháng/năm)"
                                            className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                        />
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Mã CVV"
                                                className="w-full rounded-lg border border-input bg-background pl-3.5 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                            />
                                            <Info className="w-4 h-4 text-muted-foreground absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
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
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${billingAddressType === "same"
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
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${billingAddressType === "different"
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


                        <div className="pt-4 flex items-center justify-between gap-4">
                            <Link
                                href="/shipping"
                                className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                                Quay lại giao hàng
                            </Link>

                            <Link
                                href="/order-confirmation"
                                className="inline-block rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs text-center"
                            >
                                Thanh toán ngay
                            </Link>
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
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Mã ưu đãi"
                                    className="flex-1 rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                                <button
                                    type="button"
                                    className="rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 px-5 py-2.5 text-sm font-medium transition-colors"
                                >
                                    Áp dụng
                                </button>
                            </div>


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
