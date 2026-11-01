import Link from "next/link";
import { ShoppingBag, ChevronDown } from "lucide-react";

export default function ProductsPage() {
    const products = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        tag: "Mua một lần",
    }));

    return (
        <div className="w-full bg-background text-foreground py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb  */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Trang chủ
                    </Link>
                    <span>/</span>
                    <span className="text-foreground font-medium">Sản phẩm</span>
                </nav>

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                            Khám phá sản phẩm
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Tìm sản phẩm từ người bán uy tín
                        </p>
                    </div>

                    {/* Filter / Sort Dropdowns */}
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <span>Tất cả</span>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                        >
                            <span>Sắp xếp</span>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
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

                {/* Pagination */}
                <div className="mt-14 flex items-center justify-center gap-2">
                    <button
                        type="button"
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center"
                    >
                        1
                    </button>
                    <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-medium flex items-center justify-center transition-colors"
                    >
                        2
                    </button>
                    <button
                        type="button"
                        className="w-8 h-8 rounded-full border border-border bg-background text-foreground hover:bg-muted text-xs font-medium flex items-center justify-center transition-colors"
                    >
                        3
                    </button>
                </div>
            </div>
        </div>
    );
}
