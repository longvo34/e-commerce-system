import Link from "next/link";
import { Package, Warehouse, ArrowRight } from "lucide-react";

  export default function StaffPortalPage() {
    const staffRoles = [
      {
        title: "Nhân viên Sản phẩm",
        badge: "Product Staff",
        href: "/staff/product",
        icon: Package,
        description:
          "Quản lý danh sách sản phẩm, tạo mã SKU, danh mục, giá bán và ngừng kinh doanh an toàn.",
        features: [
          "Thêm / Chỉnh sửa sản phẩm & SKU",
          "Quản lý cây danh mục sản phẩm",
          "Tải lên & quản lý hình ảnh sản phẩm",
        ],
      },
      {
        title: "Nhân viên Kho & Đơn hàng",
        badge: "Inventory Staff",
        href: "/staff/inventory",
        icon: Warehouse,
        description:
          "Theo dõi tồn kho thực tế, ghi nhận nhập xuất kho, điều chỉnh kiểm kê và tiếp nhận xử lý đơn hàng.",
        features: [
          "Ghi nhận Nhập kho / Xuất kho / Kiểm kê",
          "Tiếp nhận đơn hàng ➔ Đóng gói ➔ Giao hàng",
          "Hủy đơn hàng & Tự động hoàn kho",
        ],
      },
    ];

    return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wider mb-2">
            Hệ thống quản lý ABC
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Chọn bàn làm việc nhân viên
          </h1>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            Hệ thống phân quyền độc lập theo từng vai trò công việc. Vui lòng chọn
            khu vực làm việc phù hợp với bạn:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {staffRoles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                key={role.href}
                href={role.href}
                className="group rounded-3xl border border-border bg-card p-8 flex flex-col justify-between hover:border-foreground/50 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {role.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground group-hover:underline">
                    {role.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {role.description}
                  </p>

                  <ul className="mt-6 space-y-2 text-xs text-foreground/80">
                    {role.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60 flex items-center justify-between text-xs font-bold text-foreground">
                  <span>Truy cập bàn làm việc</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            ← Quay lại trang chủ mua sắm
          </Link>
        </div>
      </div>
    </div>
    );
  }
