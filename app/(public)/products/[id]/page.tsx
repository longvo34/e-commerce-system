"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ShoppingBag,
    ChevronDown,
    ArrowRight,
    Check,
    Truck,
    Minus,
    Plus,
} from "lucide-react";

export default function ProductDetailPage() {
    const [selectedVariant, setSelectedVariant] = useState<number>(2);
    const [selectedThumbnail, setSelectedThumbnail] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);

    const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
        id: i + 1,
        tag: "Mua một lần",
    }));

    return (
        <div className="w-full bg-background text-foreground py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. Breadcrumb  */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
                >
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <Link
                        href="/products"
                        className="hover:text-foreground transition-colors"
                    >
                        Sản phẩm
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Chi tiết sản phẩm</span>
                </nav>

                {/* 2. Top Product View: Gallery & Options (Image 1) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
                    {/* Left: Product Images Gallery */}
                    <div>
                        {/* Main Image Placeholder */}
                        <div className="aspect-square w-full rounded-2xl bg-muted border border-border/40" />

                        {/* 4 Thumbnails */}
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {Array.from({ length: 4 }, (_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setSelectedThumbnail(idx)}
                                    className={`aspect-square rounded-xl bg-muted border transition-all ${selectedThumbnail === idx
                                        ? "border-foreground ring-1 ring-foreground"
                                        : "border-border/40 hover:border-foreground/50"
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Selection & Actions */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {/* Top Right Badges / Placeholders */}
                            <div className="flex items-center gap-2 justify-end mb-6">
                                <div className="w-14 h-6 rounded-full bg-muted" />
                                <div className="w-20 h-6 rounded-full bg-muted" />
                            </div>

                            {/* Variant / Option Container */}
                            <div className="rounded-2xl border border-border bg-card p-4 space-y-3 mb-6">
                                {/* Variant 1 */}
                                <div
                                    onClick={() => setSelectedVariant(1)}
                                    className={`rounded-xl border p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${selectedVariant === 1
                                        ? "border-foreground bg-background"
                                        : "border-border hover:bg-muted/40"
                                        }`}
                                >
                                    <span
                                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariant === 1
                                            ? "border-foreground bg-foreground text-background"
                                            : "border-muted-foreground"
                                            }`}
                                    >
                                        {selectedVariant === 1 && (
                                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                                        )}
                                    </span>
                                    <span className="text-sm font-medium text-foreground">
                                        Mẫu 1
                                    </span>
                                </div>

                                {/* Variant 2 (Active in mock) */}
                                <div
                                    onClick={() => setSelectedVariant(2)}
                                    className={`rounded-xl border p-3.5 cursor-pointer transition-colors ${selectedVariant === 2
                                        ? "border-2 border-foreground bg-background"
                                        : "border-border hover:bg-muted/40"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedVariant === 2
                                                    ? "border-foreground bg-foreground text-background"
                                                    : "border-muted-foreground"
                                                    }`}
                                            >
                                                {selectedVariant === 2 && (
                                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                )}
                                            </span>
                                            <span className="text-sm font-medium text-foreground">
                                                Mẫu 2
                                            </span>
                                        </div>

                                        {/* Small Pill Dropdown */}
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                                            <span className="w-6 h-2 rounded-full bg-muted inline-block" />
                                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                                        </div>
                                    </div>

                                    {/* Detail link */}
                                    <div className="mt-4 pt-3 border-t border-border/40">
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:underline"
                                        >
                                            <span>Xem chi tiết</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="mb-6">
                                <label className="block text-xs font-semibold text-foreground mb-2">
                                    Số lượng
                                </label>
                                <div className="inline-flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-1.5">
                                    <span className="text-sm font-medium text-foreground min-w-[1.25rem] text-center">
                                        {quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                        className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <Minus className="w-3 h-3 stroke-[2.5]" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((prev) => prev + 1)}
                                        className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                                    >
                                        <Plus className="w-3 h-3 stroke-[2.5]" />
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3 mb-6">
                                <Link
                                    href="/cart"
                                    className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>+ Thêm vào giỏ</span>
                                </Link>
                                <button
                                    type="button"
                                    className="w-full rounded-xl border border-foreground bg-background text-foreground hover:bg-muted py-3.5 text-sm font-semibold text-center transition-colors"
                                >
                                    Mua
                                </button>
                            </div>

                            {/* 3 Small Feature Cards */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="aspect-[4/3] rounded-2xl bg-muted" />
                                <div className="aspect-[4/3] rounded-2xl bg-muted" />
                                <div className="aspect-[4/3] rounded-2xl bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Product Details Section (Image 2) */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Chi tiết sản phẩm
                        </h2>
                        <div className="w-28 h-7 rounded-full bg-muted" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Description Card (2 cols on lg) */}
                        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 min-h-[220px] flex flex-col justify-between">
                            <div>
                                <h3 className="text-base font-bold text-foreground mb-4">
                                    Mô tả
                                </h3>
                            </div>
                            <div>
                                <Truck className="w-5 h-5 text-foreground stroke-[1.75]" />
                            </div>
                        </div>

                        {/* Specifications Card (1 col on lg) */}
                        <div className="rounded-2xl border border-border bg-card p-6 min-h-[220px]">
                            <h3 className="text-base font-bold text-foreground mb-6">
                                Thông số kỹ thuật
                            </h3>
                            <div className="space-y-4 text-xs font-medium text-foreground">
                                <p>Kích thước</p>
                                <p>Khối lượng</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Related Products Section: Có thể bạn quan tâm (Image 2) */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Có thể bạn quan tâm
                        </h2>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <span>Tất cả sản phẩm</span>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    </div>

                    {/* 4 Related Product Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-2xl border border-border bg-card text-card-foreground p-3 hover:shadow-sm transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <Link href={`/products/${item.id}`} className="block">
                                        <div className="aspect-square w-full rounded-xl bg-muted mb-3 hover:opacity-90 transition-opacity" />
                                    </Link>
                                    <span className="inline-block rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-[11px] font-medium mb-3">
                                        {item.tag}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-foreground hover:opacity-80 transition-opacity w-fit group"
                                >
                                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:bg-primary/90 transition-colors">
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                    </span>
                                    <span className="text-xs font-medium">Thêm vào giỏ</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
