"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

export default function OrderConfirmationPage() {
  const steps = [
    { number: 1, label: "Thông tin" },
    { number: 2, label: "Giao hàng" },
    { number: 3, label: "Thanh toán", active: true },
  ];

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="w-full bg-background text-foreground py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT COLUMN: Order Success Card */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Breadcrumb Stepper */}
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
                    <span>{step.label}</span>
                  </div>

                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-1" />
                  )}
                </div>
              ))}
            </nav>

            {/* 2. Success Card */}
            <div className="rounded-3xl border border-border bg-card p-10 sm:p-14 flex flex-col items-center justify-center text-center space-y-8">
              {/* Check Circle Icon */}
              <div className="w-24 h-24 rounded-full border-4 border-muted-foreground/40 flex items-center justify-center">
                <Check className="w-12 h-12 text-muted-foreground stroke-[3]" />
              </div>

              {/* Success Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Thanh toán thành công
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm font-semibold transition-colors shadow-xs"
                >
                  Tiếp tục mua sắm
                </Link>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                >
                  In biên nhận
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Tóm tắt đơn hàng
              </h2>

              {/* Product Preview Row */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border border-border/40 flex-shrink-0">
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-xs">
                    1
                  </span>
                </div>
                <div className="flex-1" />
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Tạm tính</span>
                  <span className="font-medium text-foreground"></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Giao hàng</span>
                  <span className="font-medium text-foreground"></span>
                </div>
              </div>

              {/* Paid Row */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-base font-bold text-foreground">
                  Đã thanh toán
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
