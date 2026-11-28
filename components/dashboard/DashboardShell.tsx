"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ReportsOverview from "./ReportsOverview";
import ProductsManagementPanel from "./ProductsManagementPanel";
import CategoriesManagementPanel from "./CategoriesManagementPanel";
import InventoryManagementPanel from "./InventoryManagementPanel";
import StaffManagementPanel from "./StaffManagementPanel";
import OrdersProcessingPanel from "./OrdersProcessingPanel";
import VouchersManagementPanel from "./VouchersManagementPanel";
import ShippingConfigPanel from "./ShippingConfigPanel";
import { STATUS_THEME } from "@/constants";
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
        roles: ["admin", "product_staff",],
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
            <span className={`w-2 h-2 rounded-full ${STATUS_THEME.SUCCESS.dotColor} animate-pulse`} />
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
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors ${isActive
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${isActive
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
          {activeTab === "overview" && <ReportsOverview role={role} />}
          {activeTab === "products" && <ProductsManagementPanel />}
          {activeTab === "categories" && <CategoriesManagementPanel />}
          {activeTab === "inventory" && <InventoryManagementPanel />}
          {activeTab === "orders" && <OrdersProcessingPanel />}
          {activeTab === "staff" && <StaffManagementPanel />}
          {activeTab === "discounts" && <VouchersManagementPanel />}
          {activeTab === "shipping" && <ShippingConfigPanel />}
          {activeTab === "reviews" && <ReviewsModerationPanel />}
        </main>
      </div>
    </div>
  );
}








// =========================================================================
// 9. KIỂM DUYỆT ĐÁNH GIÁ (Admin only)
// =========================================================================
function ReviewsModerationPanel() {
  const [reviews, setReviews] = useState<
    Array<{
      id: number;
      product: string;
      customer: string;
      rating: number;
      comment: string;
      status: string;
    }>
  >([]);

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

      {reviews.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border bg-card/50">
          <MessageSquareWarning className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium text-muted-foreground">
            Không có đánh giá nào cần kiểm duyệt.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Các đánh giá từ người dùng sẽ hiển thị tại đây khi hệ thống nhận được dữ liệu.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm">{r.product}</span>
                  <span className={`text-xs font-semibold ${STATUS_THEME.WARNING.textColor}`}>★ {r.rating}/5</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${r.status === "Hiển thị"
                      ? STATUS_THEME.SUCCESS.badgeClass
                      : STATUS_THEME.DANGER.badgeClass
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
      )}
    </div>
  );
}
