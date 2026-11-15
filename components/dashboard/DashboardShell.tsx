"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Layers,
  Warehouse,
  ClipboardList,
  Users,
  TicketPercent,
  Truck,
  MessageSquareWarning,
  LogOut,
  Menu,
  X,
  Plus,
  Shield,
  Lock,
  Unlock,
} from "lucide-react";

export type RoleType = "admin" | "product_staff" | "inventory_staff";

export type TabKey =
  | "overview"
  | "products"
  | "categories"
  | "inventory"
  | "orders"
  | "staff"
  | "discounts"
  | "shipping"
  | "reviews";

interface DashboardShellProps {
  role: RoleType;
  title?: string;
  roleBadge?: string;
}

export default function DashboardShell({
  role,
  title,
  roleBadge,
}: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Cấu hình thông tin hiển thị theo role
  const roleConfig = useMemo(() => {
    switch (role) {
      case "product_staff":
        return {
          title: title || "Bàn làm việc Sản phẩm & Danh mục",
          badge: roleBadge || "Product Staff",
          userTitle: "Nhân viên Sản phẩm",
          avatarText: "PS",
        };
      case "inventory_staff":
        return {
          title: title || "Bàn làm việc Kho & Xử lý đơn hàng",
          badge: roleBadge || "Inventory Staff",
          userTitle: "Nhân viên Kho & Đơn hàng",
          avatarText: "IS",
        };
      case "admin":
      default:
        return {
          title: title || "Bảng điều khiển Quản trị viên",
          badge: roleBadge || "Quản trị viên (Admin)",
          userTitle: "Chủ cửa hàng (Admin)",
          avatarText: "AD",
        };
    }
  }, [role, title, roleBadge]);

  // Lọc danh mục menu sidebar theo URL Role cố định
  const navigationItems = useMemo(() => {
    const allItems = [
      {
        key: "overview" as TabKey,
        label: "Tổng quan",
        icon: LayoutDashboard,
        roles: ["admin", "product_staff", "inventory_staff"],
      },
      {
        key: "products" as TabKey,
        label: "Sản phẩm & SKU",
        icon: Package,
        roles: ["admin", "product_staff"],
      },
      {
        key: "categories" as TabKey,
        label: "Danh mục sản phẩm",
        icon: Layers,
        roles: ["admin", "product_staff"],
      },
      {
        key: "inventory" as TabKey,
        label: "Kho hàng & Nhập xuất",
        icon: Warehouse,
        roles: ["admin", "inventory_staff"],
      },
      {
        key: "orders" as TabKey,
        label: "Xử lý đơn hàng",
        icon: ClipboardList,
        roles: ["admin", "inventory_staff"],
      },
      {
        key: "staff" as TabKey,
        label: "Nhân viên & Phân quyền",
        icon: Users,
        roles: ["admin"],
      },
      {
        key: "discounts" as TabKey,
        label: "Chương trình giảm giá",
        icon: TicketPercent,
        roles: ["admin"],
      },
      {
        key: "shipping" as TabKey,
        label: "Biểu phí vận chuyển",
        icon: Truck,
        roles: ["admin"],
      },
      {
        key: "reviews" as TabKey,
        label: "Kiểm duyệt đánh giá",
        icon: MessageSquareWarning,
        roles: ["admin"],
      },
    ];

    return allItems.filter((item) => item.roles.includes(role));
  }, [role]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-card">
        {/* Brand Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-foreground">
              ABC
            </span>
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
              Dashboard
            </span>
          </Link>
        </div>

        {/* Role Badge Indicator */}
        <div className="px-5 py-3.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-foreground">
              {roleConfig.badge}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-xs text-secondary-foreground border border-border">
              {roleConfig.avatarText}
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-foreground">
                {roleConfig.userTitle}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase">
                {role.replace("_", " ")}
              </p>
            </div>
          </div>
          <Link
            href="/"
            title="Quay lại trang chủ"
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-card border-r border-border flex flex-col z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <span className="font-bold text-lg text-foreground">ABC Dashboard</span>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.key);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 sm:h-20 border-b border-border px-4 sm:px-8 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                {navigationItems.find((n) => n.key === activeTab)?.label || roleConfig.title}
              </h2>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {roleConfig.badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
            >
              Xem trang web
            </Link>
          </div>
        </header>

        {/* Dynamic Tab Content Renderer */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === "overview" && <OverviewPanel role={role} />}
          {activeTab === "products" && <ProductsManagementPanel />}
          {activeTab === "categories" && <CategoriesManagementPanel />}
          {activeTab === "inventory" && <InventoryManagementPanel />}
          {activeTab === "orders" && <OrdersProcessingPanel />}
          {activeTab === "staff" && <StaffManagementPanel />}
          {activeTab === "discounts" && <DiscountsManagementPanel />}
          {activeTab === "shipping" && <ShippingConfigPanel />}
          {activeTab === "reviews" && <ReviewsModerationPanel />}
        </main>
      </div>
    </div>
  );
}

// =========================================================================
// 1. TỔNG QUAN (Phân biệt theo Role)
// =========================================================================
function OverviewPanel({ role }: { role: RoleType }) {
  const metrics = useMemo(() => {
    if (role === "product_staff") {
      return [
        { title: "Tổng sản phẩm quản lý", value: "148 SP", change: "+12 SP mới", isPositive: true },
        { title: "Đang kinh doanh", value: "135 SP", change: "Hoạt động tốt", isPositive: true },
        { title: "Ngừng kinh doanh an toàn", value: "13 SP", change: "Lưu lịch sử", isPositive: true },
        { title: "Danh mục sản phẩm", value: "8 danh mục", change: "Chuẩn cây DM", isPositive: true },
      ];
    }
    if (role === "inventory_staff") {
      return [
        { title: "Đơn hàng chờ tiếp nhận", value: "24 đơn", change: "Cần xử lý gấp", isPositive: false },
        { title: "Đang chuẩn bị & đóng gói", value: "38 đơn", change: "+8 đơn", isPositive: true },
        { title: "Đang giao vận", value: "65 đơn", change: "Đang trên đường", isPositive: true },
        { title: "Cảnh báo tồn kho thấp", value: "14 SP", change: "< 10 cái", isPositive: false },
      ];
    }
    // Admin
    return [
      { title: "Doanh thu (Đã trừ đơn huỷ)", value: "148.250.000₫", change: "+14.8%", isPositive: true },
      { title: "Tổng số đơn hàng", value: "1.842 đơn", change: "+8.5%", isPositive: true },
      { title: "Đơn hàng bị huỷ & hoàn kho", value: "112 đơn", change: "Đã hoàn kho", isPositive: true },
      { title: "Nhân viên hoạt động", value: "6 nhân viên", change: "Phân quyền chuẩn", isPositive: true },
    ];
  }, [role]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{m.title}</p>
              <h3 className="text-2xl font-black text-foreground mt-2">{m.value}</h3>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs flex items-center justify-between">
              <span className={`font-bold ${m.isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-bold text-sm text-foreground mb-4">
          Quy tắc nghiệp vụ đang áp dụng ({role.toUpperCase()})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
            <p className="font-semibold text-foreground">Kiểm soát truy cập (Access Control)</p>
            <p className="text-muted-foreground mt-1">
              Hệ thống giới hạn quyền truy cập chặt chẽ theo URL và phân quyền trong Báo cáo phân tích.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-muted/50 border border-border">
            <p className="font-semibold text-foreground">Toàn vẹn dữ liệu (Data Integrity)</p>
            <p className="text-muted-foreground mt-1">
              Không cho phép tồn kho âm, tự động hoàn kho khi hủy đơn và ngăn chặn ghi nhận trùng lặp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 2. QUẢN LÝ SẢN PHẨM & SKU (Product Staff & Admin)
// =========================================================================
function ProductsManagementPanel() {
  const [productsList] = useState([
    { id: "SP01", sku: "TSHIRT-BLK-01", name: "Áo Thun Cotton Form Rộng", category: "Áo thun", price: "250.000₫", stock: 45, status: "Đang kinh doanh" },
    { id: "SP02", sku: "JEANS-SLIM-02", name: "Quần Jeans Slimfit Co Giãn", category: "Quần jeans", price: "480.000₫", stock: 18, status: "Đang kinh doanh" },
    { id: "SP03", sku: "JACKET-BM-03", name: "Áo Khoác Bomber Kaki Đen", category: "Áo khoác", price: "650.000₫", stock: 0, status: "Ngừng kinh doanh" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Danh sách sản phẩm & Mã SKU (UC02 - Product Staff)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý tên, mã barcode/SKU, giá bán không âm, hình ảnh và ngừng kinh doanh an toàn.
          </p>
        </div>
        <button
          onClick={() => alert("Mở form thêm sản phẩm mới (Nhập tên, SKU, giá bán, ảnh, mô tả)")}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[11px]">
            <tr>
              <th className="px-5 py-3">Mã SKU</th>
              <th className="px-5 py-3">Tên sản phẩm</th>
              <th className="px-5 py-3">Danh mục</th>
              <th className="px-5 py-3">Giá bán</th>
              <th className="px-5 py-3">Tồn khả dụng</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productsList.map((p) => (
              <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-foreground">{p.sku}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground">{p.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{p.category}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground">{p.price}</td>
                <td className="px-5 py-3.5">
                  <span className={`font-semibold ${p.stock === 0 ? "text-rose-500" : "text-foreground"}`}>
                    {p.stock} cái
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      p.status === "Đang kinh doanh"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-2">
                  <button onClick={() => alert(`Chỉnh sửa ${p.name}`)} className="text-xs text-foreground underline hover:opacity-70">
                    Sửa
                  </button>
                  <button onClick={() => alert(`Ngừng kinh doanh an toàn ${p.name}`)} className="text-xs text-rose-500 hover:underline">
                    Ngừng bán
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 3. QUẢN LÝ DANH MỤC (Product Staff & Admin)
// =========================================================================
function CategoriesManagementPanel() {
  const categories = [
    { id: 1, name: "Áo thun nam/nữ", productCount: 42, status: "Đang sử dụng" },
    { id: 2, name: "Quần jeans & kaki", productCount: 28, status: "Đang sử dụng" },
    { id: 3, name: "Áo khoác gió & nỉ", productCount: 15, status: "Đang sử dụng" },
    { id: 4, name: "Phụ kiện thời trang", productCount: 64, status: "Đang sử dụng" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Danh mục sản phẩm (Product Staff)</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý cây danh mục sản phẩm (Kiểm tra liên kết trước khi xóa).
          </p>
        </div>
        <button
          onClick={() => alert("Mở modal thêm danh mục")}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5">
            <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">{c.productCount} sản phẩm liên kết</p>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{c.status}</span>
              <button onClick={() => alert(`Chỉnh sửa danh mục ${c.name}`)} className="underline text-muted-foreground hover:text-foreground">
                Chỉnh sửa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 4. QUẢN LÝ KHO & NHẬP XUẤT (Inventory Staff & Admin)
// =========================================================================
function InventoryManagementPanel() {
  const inventoryHistory = [
    { id: "NK-001", type: "Nhập kho", sku: "TSHIRT-BLK-01", product: "Áo Thun Cotton Form Rộng", qty: "+50", staff: "Inventory Staff (Kho 1)", date: "12/11/2026 14:00", note: "Nhập hàng từ xưởng may" },
    { id: "XK-002", type: "Xuất kho đơn hàng", sku: "JEANS-SLIM-02", product: "Quần Jeans Slimfit Co Giãn", qty: "-2", staff: "Hệ thống tự động", date: "12/11/2026 10:15", note: "Đơn #ORD-9820 xác nhận" },
    { id: "DC-003", type: "Điều chỉnh kiểm kê", sku: "JACKET-BM-03", product: "Áo Khoác Bomber Kaki Đen", qty: "-1", staff: "Nguyễn Văn Kho", date: "11/11/2026 18:00", note: "Hàng lỗi đường may sau kiểm kê" },
    { id: "HK-004", type: "Hoàn kho huỷ đơn", sku: "TSHIRT-BLK-01", product: "Áo Thun Cotton Form Rộng", qty: "+1", staff: "Hệ thống tự động", date: "11/11/2026 09:30", note: "Khách huỷ đơn #ORD-9818" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Quản lý Kho & Lịch sử Nhập / Xuất / Điều chỉnh (Inventory Staff)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Không cho phép tồn kho âm. Hoàn kho an toàn khi huỷ đơn, ngăn chặn cập nhật trùng lặp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Ghi nhận giao dịch Nhập kho")}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90"
          >
            + Ghi nhận nhập kho
          </button>
          <button
            onClick={() => alert("Điều chỉnh tồn kho sau kiểm kê")}
            className="rounded-xl border border-border bg-background px-4 py-2 text-xs font-semibold hover:bg-muted"
          >
            Điều chỉnh kiểm kê
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[11px]">
            <tr>
              <th className="px-5 py-3">Mã GD</th>
              <th className="px-5 py-3">Loại giao dịch</th>
              <th className="px-5 py-3">Sản phẩm</th>
              <th className="px-5 py-3">Số lượng</th>
              <th className="px-5 py-3">Người thực hiện</th>
              <th className="px-5 py-3">Ghi chú</th>
              <th className="px-5 py-3">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {inventoryHistory.map((item) => (
              <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3 font-mono font-bold text-foreground">{item.id}</td>
                <td className="px-5 py-3 font-semibold text-foreground">{item.type}</td>
                <td className="px-5 py-3 text-foreground">{item.product}</td>
                <td className="px-5 py-3 font-mono font-bold">
                  <span className={item.qty.startsWith("+") ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
                    {item.qty}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{item.staff}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{item.note}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 5. XỬ LÝ ĐƠN HÀNG (Inventory Staff & Admin)
// =========================================================================
function OrdersProcessingPanel() {
  const [orders, setOrders] = useState([
    { id: "ORD-9821", customer: "Nguyễn Văn An", total: "1.250.000₫", status: "Chờ xác nhận", address: "123 Đường ABC, Quận 1, TP. HCM", payment: "Đã thanh toán" },
    { id: "ORD-9820", customer: "Trần Thị Mai", total: "680.000₫", status: "Đang chuẩn bị", address: "456 Lê Lợi, Đà Nẵng", payment: "COD" },
    { id: "ORD-9819", customer: "Lê Hoàng Long", total: "2.400.000₫", status: "Đang giao", address: "789 Phố Huế, Hà Nội", payment: "Đã thanh toán" },
    { id: "ORD-9818", customer: "Phạm Thùy Linh", total: "450.000₫", status: "Đã huỷ", address: "Cầu Giấy, Hà Nội", payment: "Hoàn kho thành công" },
  ]);

  const updateStatus = (orderId: string, nextStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base text-foreground">
          Quy trình xử lý đơn hàng (UC04 - Inventory Staff)
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tiếp nhận đơn ➔ Đóng gói chuẩn bị ➔ Bàn giao shipper giao hàng ➔ Xác nhận đã giao (hoặc Huỷ & Hoàn kho).
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[11px]">
            <tr>
              <th className="px-5 py-3">Mã đơn</th>
              <th className="px-5 py-3">Khách hàng & Địa chỉ</th>
              <th className="px-5 py-3">Tổng tiền</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3 text-right">Thao tác quy trình</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5 font-bold font-mono text-foreground">{o.id}</td>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-foreground">{o.customer}</p>
                  <p className="text-xs text-muted-foreground truncate max-w-xs">{o.address}</p>
                </td>
                <td className="px-5 py-3.5 font-bold text-foreground">{o.total}</td>
                <td className="px-5 py-3.5">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1.5">
                  {o.status === "Chờ xác nhận" && (
                    <button
                      onClick={() => updateStatus(o.id, "Đang chuẩn bị")}
                      className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                    >
                      Tiếp nhận đóng gói
                    </button>
                  )}
                  {o.status === "Đang chuẩn bị" && (
                    <button
                      onClick={() => updateStatus(o.id, "Đang giao")}
                      className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90"
                    >
                      Bàn giao shipper
                    </button>
                  )}
                  {o.status === "Đang giao" && (
                    <button
                      onClick={() => updateStatus(o.id, "Đã giao")}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium"
                    >
                      Xác nhận đã giao
                    </button>
                  )}
                  {o.status !== "Đã giao" && o.status !== "Đã huỷ" && (
                    <button
                      onClick={() => {
                        const reason = prompt("Nhập lý do huỷ đơn hàng & hoàn kho:");
                        if (reason) updateStatus(o.id, "Đã huỷ");
                      }}
                      className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-500 text-xs hover:bg-rose-50"
                    >
                      Huỷ & Hoàn kho
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 6. QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN (Admin only)
// =========================================================================
function StaffManagementPanel() {
  const [staffList, setStaffList] = useState([
    { id: 1, name: "Trần Văn Bình", email: "binh.tv@abcstore.com", role: "Product Staff", status: "Đang hoạt động", assignedAt: "01/10/2026" },
    { id: 2, name: "Lê Hoàng Kho", email: "kho.lh@abcstore.com", role: "Inventory Staff", status: "Đang hoạt động", assignedAt: "05/10/2026" },
    { id: 3, name: "Nguyễn Thị Thảo", email: "thao.nt@abcstore.com", role: "Product Staff", status: "Đã khóa", assignedAt: "12/09/2026" },
  ]);

  const toggleLock = (id: number) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Đang hoạt động" ? "Đã khóa" : "Đang hoạt động" }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Quản lý tài khoản nhân viên & Phân quyền (Admin)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Admin phân quyền nhân viên theo vai trò: Product Staff hoặc Inventory Staff.
          </p>
        </div>
        <button
          onClick={() => alert("Mở form tạo tài khoản nhân viên & gán vai trò")}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90"
        >
          + Thêm nhân viên
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[11px]">
            <tr>
              <th className="px-5 py-3">Họ và tên</th>
              <th className="px-5 py-3">Email đăng nhập</th>
              <th className="px-5 py-3">Vai trò phân quyền</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3">Ngày cấp quyền</th>
              <th className="px-5 py-3 text-right">Khóa / Mở khóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {staffList.map((s) => (
              <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5 font-bold text-foreground">{s.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{s.email}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">
                    <Shield className="w-3 h-3 text-primary" />
                    {s.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      s.status === "Đang hoạt động"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.assignedAt}</td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => toggleLock(s.id)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                  >
                    {s.status === "Đang hoạt động" ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-rose-500" />
                        <span>Khóa</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Mở khóa</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================================
// 7. QUẢN LÝ CHƯƠNG TRÌNH GIẢM GIÁ (Admin only)
// =========================================================================
function DiscountsManagementPanel() {
  const discounts = [
    { code: "WELCOMEABC", discount: "Giảm 10%", minOrder: "Đơn từ 200.000₫", expiry: "31/12/2026", status: "Đang kích hoạt" },
    { code: "FREESHIP50", discount: "Miễn phí ship (Tối đa 50k)", minOrder: "Đơn từ 500.000₫", expiry: "30/11/2026", status: "Đang kích hoạt" },
    { code: "BLACKFRIDAY", discount: "Giảm 30%", minOrder: "Đơn từ 1.000.000₫", expiry: "28/11/2026", status: "Chưa kích hoạt" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Chương trình giảm giá & Mã khuyến mãi (Admin)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cấu hình mã giảm giá, thời hạn áp dụng, giá trị giảm và điều kiện tối thiểu.
          </p>
        </div>
        <button
          onClick={() => alert("Mở form tạo mã giảm giá mới")}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90"
        >
          + Tạo mã giảm giá
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {discounts.map((d) => (
          <div key={d.code} className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground border border-border">
                {d.code}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">{d.status}</span>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{d.discount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Điều kiện: {d.minOrder}</p>
              <p className="text-xs text-muted-foreground">Hạn dùng: {d.expiry}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 8. CẤU HÌNH PHÍ VẬN CHUYỂN (Admin only)
// =========================================================================
function ShippingConfigPanel() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h3 className="font-bold text-base text-foreground">
          Cấu hình biểu phí vận chuyển (Admin)
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Thiết lập phí giao hàng áp dụng cho giỏ hàng theo khu vực và chính sách miễn phí ship.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">
            Phí giao hàng tiêu chuẩn mặc định
          </label>
          <input
            type="text"
            defaultValue="30.000₫"
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">
            Ngưỡng đơn hàng được MIỄN PHÍ VẬN CHUYỂN (Freeship threshold)
          </label>
          <input
            type="text"
            defaultValue="500.000₫"
            className="w-full rounded-lg border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:ring-1 focus:ring-ring"
          />
        </div>

        <button
          onClick={() => alert("Đã lưu cấu hình biểu phí vận chuyển!")}
          className="rounded-xl bg-primary text-primary-foreground px-6 py-2.5 text-xs font-semibold hover:bg-primary/90"
        >
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// 9. KIỂM DUYỆT ĐÁNH GIÁ (Admin only)
// =========================================================================
function ReviewsModerationPanel() {
  const [reviews, setReviews] = useState([
    { id: 1, product: "Áo Thun Cotton Form Rộng", customer: "Lê Văn C", rating: 5, comment: "Vải dày dặn, mặc mát và form rất chuẩn, sẽ ủng hộ tiếp!", status: "Hiển thị" },
    { id: 2, product: "Quần Jeans Slimfit", customer: "Báo cáo nặc danh", rating: 1, comment: "Hàng giả mạo lừa đảo mọi người đừng mua abcxyz...", status: "Bị báo cáo vi phạm" },
  ]);

  const toggleReviewStatus = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "Hiển thị" ? "Đã ẩn (Vi phạm)" : "Hiển thị" }
          : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-base text-foreground">
          Quản lý & Kiểm duyệt đánh giá (Admin)
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quy định: Admin có quyền ẩn hoặc khôi phục các đánh giá vi phạm chính sách. Đánh giá bị ẩn không tính vào điểm sao trung bình.
        </p>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground text-sm">{r.product}</span>
                <span className="text-xs text-amber-500 font-semibold">★ {r.rating}/5</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    r.status === "Hiển thị"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-rose-500/10 text-rose-600 font-semibold"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Người gửi: {r.customer}</p>
              <p className="text-sm text-foreground mt-2 italic">&ldquo;{r.comment}&rdquo;</p>
            </div>

            <button
              onClick={() => toggleReviewStatus(r.id)}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted flex-shrink-0"
            >
              {r.status === "Hiển thị" ? "Ẩn đánh giá này" : "Khôi phục hiển thị"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
