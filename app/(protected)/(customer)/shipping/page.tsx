"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function ShippingPage() {
    const [selectedShipping, setSelectedShipping] = useState<string>("standard");
    const [discountCode, setDiscountCode] = useState("");

    const steps = [
        { number: 1, label: "Thông tin", href: "/profile-confirmation", completed: true },
        { number: 2, label: "Giao hàng", active: true },
        { number: 3, label: "Thanh toán", active: false },
    ];

    return (
        <div className="w-full bg-background text-foreground py-10 sm:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* LEFT COLUMN: Shipping Selection */}
                    <div className="lg:col-span-7 space-y-8">
                        {/* 1. Breadcrumb Stepper */}
                        <nav
                            aria-label="Tiến trình đặt hàng"
                            className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium"
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

                            <div className="pt-3.5 flex items-center justify-between gap-4">
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
                        </div>

                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
                                Phương thức giao hàng
                            </h2>

                            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                                <label
                                    onClick={() => setSelectedShipping("standard")}
                                    className="flex items-center justify-between gap-4 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedShipping === "standard"
                                                    ? "border-foreground"
                                                    : "border-muted-foreground"
                                                }`}
                                        >
                                            {selectedShipping === "standard" && (
                                                <span className="w-2 h-2 rounded-full bg-foreground" />
                                            )}
                                        </span>
                                        <span className="text-sm font-medium text-foreground">
                                            Giao hàng tiêu chuẩn
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                        Miễn phí
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="pt-6 flex items-center justify-between gap-4">
                            <Link
                                href="/profile-confirmation"
                                className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                            >
                                Quay lại thông tin
                            </Link>

                            <Link
                                href="/payment"
                                className="inline-block rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs text-center"
                            >
                                Tiếp tục thanh toán
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary Card */}
                    <div className="lg:col-span-5">
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-6">
                            {/* Product Preview Row */}
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border border-border/40 flex-shrink-0">
                                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-xs">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1" />
                            </div>

                            {/* Discount Code Input */}
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

                            {/* Price Breakdown */}
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

                            {/* Total Row */}
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
