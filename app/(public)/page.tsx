import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  ChevronDown,
  Check,
  Headphones,
  RotateCcw,
  CreditCard,
} from "lucide-react";

export default function HomePage() {
  const products = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    tag: "Mua một lần",
  }));

  const productGroups = [
    { id: 1, name: "Nhóm 1" },
    { id: 2, name: "Nhóm 2" },
    { id: 3, name: "Nhóm 3" },
    { id: 4, name: "Nhóm 4" },
  ];

  const policyChecklist = [
    "Tìm kiếm sản phẩm nhanh chóng theo nhu cầu mua sắm.",
    "Theo dõi giảm giá, miễn phí vận chuyển và ưu đãi thành viên.",
    "Đổi trả dễ dàng và thanh toán an toàn cho mỗi đơn hàng.",
    "Hỗ trợ khách hàng và chính sách rõ ràng cho người mua.",
  ];

  return (
    <div className="w-full bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-16">
        <div className="max-w-3xl">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide">
            Mua sắm an toàn
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.12]">
            Khám phá sản phẩm chất lượng từ người bán uy tín
          </h1>
          <p className="mt-5 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Tìm kiếm sản phẩm, theo dõi ưu đãi và mua sắm dễ dàng với chính sách
            đổi trả linh hoạt cùng thanh toán an toàn.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Khám phá</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Tìm kiếm sản phẩm
            </Link>
          </div>
        </div>

        {/* 3 Quick Benefit Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-muted/70 p-5 border border-border/50">
            <h3 className="text-sm font-bold text-foreground">Tìm kiếm</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Tìm nhanh sản phẩm theo nhu cầu mua sắm.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/70 p-5 border border-border/50">
            <h3 className="text-sm font-bold text-foreground">Ưu đãi</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Theo dõi giảm giá, miễn phí vận chuyển và ưu đãi thành viên.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/70 p-5 border border-border/50">
            <h3 className="text-sm font-bold text-foreground">Hỗ trợ</h3>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Đổi trả dễ dàng và thanh toán an toàn cho mỗi đơn hàng.
            </p>
          </div>
        </div>

        {/* Big Hero Banner Placeholder */}
        <div className="mt-8 w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-2xl bg-muted border border-border" />
      </section>

      {/* 2. KHÁM PHÁ SẢN PHẨM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Khám phá sản phẩm
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tìm sản phẩm từ người bán uy tín
            </p>
          </div>

          {/* Filter / Sort Dropdowns */}
          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>Tất cả</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
            >
              <span>Sắp xếp</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Product Grid: 8 Items (2 rows of 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-card text-card-foreground p-3 hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square w-full rounded-xl bg-muted mb-3" />
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
      </section>

      {/* 3. CHÍNH SÁCH MUA SẮM BANNER */}
      <section className="w-full bg-muted/40 border-y border-border py-16 sm:py-20 my-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <span className="text-xs font-medium text-muted-foreground tracking-wide">
                Chính sách mua sắm
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-foreground leading-tight">
                Mua sắm dễ dàng với chính sách an tâm
              </h2>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-lg">
                Tìm kiếm nhanh, theo dõi ưu đãi và tận hưởng mua sắm an toàn với
                các chính sách hỗ trợ rõ ràng.
              </p>

              {/* Checklist */}
              <ul className="mt-8 space-y-4">
                {policyChecklist.map((policy, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <span className="text-xs sm:text-sm text-foreground">
                      {policy}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <div className="mt-8">
                <button
                  type="button"
                  className="inline-block rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Xem thêm
                </button>
              </div>
            </div>

            {/* Right Large Placeholder */}
            <div>
              <div className="w-full aspect-[4/3] rounded-2xl bg-muted border border-border/40" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. HỖ TRỢ MUA SẮM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Hỗ trợ mua sắm
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Thông tin hỗ trợ và chính sách mua sắm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-foreground">
                <Headphones className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Hỗ trợ khách hàng
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-6">Trợ giúp mua sắm</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-foreground">
                <RotateCcw className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Chính sách đổi trả
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-6">Đổi trả dễ dàng</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between min-h-[170px]">
            <div>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-foreground">
                <CreditCard className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Thanh toán an toàn
              </h3>
            </div>
            <p className="text-xs text-muted-foreground mt-6">Thanh toán</p>
          </div>
        </div>
      </section>

      {/* 5. NHÓM SẢN PHẨM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Nhóm sản phẩm
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Khám phá nhóm sản phẩm nổi bật
          </p>
        </div>

        {/* 4 Group Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-border bg-card p-3 hover:shadow-sm transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square w-full rounded-xl bg-muted mb-3" />
                <span className="inline-block rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 text-[11px] font-medium mb-3">
                  {group.name}
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
      </section>
    </div>
  );
}
