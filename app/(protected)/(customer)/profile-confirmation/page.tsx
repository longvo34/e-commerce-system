"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function ProfileConfirmationPage() {
    const router = useRouter();
    const [discountCode, setDiscountCode] = useState("");
    const [saveInfo, setSaveInfo] = useState(false);

    const steps = [
        { number: 1, label: "Thông tin", active: true },
        { number: 2, label: "Giao hàng", active: false },
        { number: 3, label: "Thanh toán", active: false },
    ];

    return (
        <div className="w-full bg-background text-foreground py-10 sm:py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    <div className="lg:col-span-7 space-y-8">
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
                                        <span>{step.label}</span>
                                    </div>

                                    {idx < steps.length - 1 && (
                                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 ml-1" />
                                    )}
                                </div>
                            ))}
                        </nav>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base sm:text-lg font-bold text-foreground">
                                    Liên hệ
                                </h2>

                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Email hoặc số điện thoại"
                                    className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                />
                            </div>

                            <div className="mt-3 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="newsletter"
                                    className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                                />
                                <label
                                    htmlFor="newsletter"
                                    className="text-xs text-muted-foreground cursor-pointer select-none"
                                >
                                    Gửi cho tôi thông tin ưu đãi và cập nhật qua email
                                </label>
                            </div>
                        </div>


                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4">
                                Địa chỉ giao hàng
                            </h2>

                            <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-3.5">
                                    <input
                                        type="text"
                                        placeholder="Tên"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Họ"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Số nhà, tên đường"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Ghi chú giao hàng (tuỳ chọn)"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                                    <input
                                        type="text"
                                        placeholder="Thành phố"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Mã bưu chính"
                                        className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                                    />
                                    <div className="relative">
                                        <select
                                            defaultValue=""
                                            className="w-full appearance-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-9 cursor-pointer"
                                        >
                                            <option value="" disabled>
                                                Tỉnh/Thành phố
                                            </option>
                                            <option value="HN">Hà Nội</option>
                                            <option value="HCM">TP. Hồ Chí Minh</option>
                                            <option value="DN">Đà Nẵng</option>
                                            <option value="other">Tỉnh khác...</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="relative">
                                    <select
                                        defaultValue="VN"
                                        className="w-full appearance-none rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all pr-9 cursor-pointer"
                                    >
                                        <option value="VN">Việt Nam</option>
                                        <option value="US">Hoa Kỳ (US)</option>
                                        <option value="JP">Nhật Bản</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                {/* <div className="pt-1 flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="save-info"
                                            checked={saveInfo}
                                            onChange={(e) => setSaveInfo(e.target.checked)}
                                            className="w-4 h-4 rounded border-input text-primary focus:ring-ring"
                                        />
                                        <label
                                            htmlFor="save-info"
                                            className="text-xs text-muted-foreground cursor-pointer select-none"
                                        >
                                            Lưu thông tin cho lần mua sau
                                        </label>
                                    </div> */}

                                <div className="pt-6 flex items-center justify-between gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity"
                                    >
                                        Quay về
                                    </button>

                                    <Link
                                        href="/shipping"
                                        className="inline-block rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs text-center"
                                    >
                                        Tiếp tục giao hàng
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border border-border/40 flex-shrink-0">
                                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shadow-xs">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1">
                                </div>
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
                                    <span className="text-xs text-muted-foreground">
                                        Tính ở bước tiếp theo
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
