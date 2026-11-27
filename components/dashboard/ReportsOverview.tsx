"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  TrendingUp,
  Clock,
  PackageCheck,
  Truck,
  RotateCcw,
  RefreshCw,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  getRevenue,
  getOrdersCountByStatus,
  getLowStock,
} from "@/services/reports";
import { ORDER_STATUS_MAP, STATUS_THEME } from "@/constants";
import { OrdersCountByStatus, LowStockProduct } from "@/types";

export type RoleType = "admin" | "product_staff" | "inventory_staff";

interface ReportsOverviewProps {
  role: RoleType;
}

export default function ReportsOverview({ role }: ReportsOverviewProps) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [threshold, setThreshold] = useState<number>(10);

  // Dữ liệu từ 3 API
  const [ordersStats, setOrdersStats] = useState<OrdersCountByStatus>({
    PENDING: 0,
    PREPARING: 0,
    SHIPPING: 0,
    DELIVERED: 0,
    CANCELLED: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);
  const [revenueTotal, setRevenueTotal] = useState<number>(0);
  const [revenueList, setRevenueList] = useState<
    { label: string; amount: number }[]
  >([]);

  // Hàm tải dữ liệu từ 3 API
  const fetchReportData = useCallback(async () => {
    try {
      // 1. Lấy thống kê số lượng đơn hàng theo trạng thái
      const ordersRes = await getOrdersCountByStatus().catch(() => null);
      if (ordersRes && typeof ordersRes === "object") {
        setOrdersStats(ordersRes);
      } else {
        setOrdersStats({
          PENDING: 0,
          PREPARING: 0,
          SHIPPING: 0,
          DELIVERED: 0,
          CANCELLED: 0,
        });
      }

      // 2. Lấy danh sách sản phẩm sắp hết hàng
      const lowStockRes = await getLowStock(threshold).catch(() => null);
      if (Array.isArray(lowStockRes)) {
        setLowStockProducts(lowStockRes);
      } else {
        setLowStockProducts([]);
      }

      // 3. Lấy báo cáo doanh thu
      const revenueRes = await getRevenue({ groupBy }).catch(() => null);
      if (revenueRes && typeof revenueRes === "object" && revenueRes !== null) {
        const resObj = revenueRes as Record<string, unknown>;
        if (typeof resObj.total === "number") {
          setRevenueTotal(resObj.total);
        } else if (typeof resObj.totalRevenue === "number") {
          setRevenueTotal(resObj.totalRevenue);
        } else {
          setRevenueTotal(0);
        }
        if (Array.isArray(resObj.data)) {
          const parsed = resObj.data.map((item: Record<string, unknown>) => ({
            label: String(item.date || item.period || item.label || ""),
            amount: Number(item.revenue || item.total || item.amount || 0),
          }));
          setRevenueList(parsed);
        } else {
          setRevenueList([]);
        }
      } else {
        setRevenueTotal(0);
        setRevenueList([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [groupBy, threshold]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  // Tính tổng số đơn hàng
  const totalOrders = useMemo(() => {
    return (
      (ordersStats.PENDING || 0) +
      (ordersStats.PREPARING || 0) +
      (ordersStats.SHIPPING || 0) +
      (ordersStats.DELIVERED || 0) +
      (ordersStats.CANCELLED || 0)
    );
  }, [ordersStats]);

  // Cấu hình thẻ KPI trên cùng theo từng role
  const kpiCards = useMemo(() => {
    if (role === "inventory_staff") {
      return [
        {
          title: "Đơn hàng chờ tiếp nhận",
          value: `${ordersStats.PENDING || 0} đơn`,
          desc: "Cần tiếp nhận ngay",
          icon: Clock,
          color: STATUS_THEME.WARNING.textColor,
          bgColor: STATUS_THEME.WARNING.bgColor,
        },
        {
          title: "Đang đóng gói & chuẩn bị",
          value: `${ordersStats.PREPARING || 0} đơn`,
          desc: "Đang xuất kho đóng gói",
          icon: PackageCheck,
          color: STATUS_THEME.INFO.textColor,
          bgColor: STATUS_THEME.INFO.bgColor,
        },
        {
          title: "Đang giao vận",
          value: `${ordersStats.SHIPPING || 0} đơn`,
          desc: "Đang trên đường giao",
          icon: Truck,
          color: STATUS_THEME.PURPLE.textColor,
          bgColor: STATUS_THEME.PURPLE.bgColor,
        },
        {
          title: "Cảnh báo tồn kho thấp",
          value: `${lowStockProducts.length} SP`,
          desc: `Tồn kho ≤ ${threshold} cái`,
          icon: AlertTriangle,
          color: STATUS_THEME.DANGER.textColor,
          bgColor: STATUS_THEME.DANGER.bgColor,
        },
      ];
    }

    if (role === "product_staff") {
      return [
        {
          title: "Sản phẩm sắp hết hàng",
          value: `${lowStockProducts.length} SP`,
          desc: `Cần bổ sung kho (≤ ${threshold})`,
          icon: AlertTriangle,
          color: STATUS_THEME.DANGER.textColor,
          bgColor: STATUS_THEME.DANGER.bgColor,
        },
        {
          title: "Đơn hàng giao thành công",
          value: `${ordersStats.DELIVERED || 0} đơn`,
          desc: "Sản phẩm đã bán & giao",
          icon: PackageCheck,
          color: STATUS_THEME.SUCCESS.textColor,
          bgColor: STATUS_THEME.SUCCESS.bgColor,
        },
        {
          title: "Tổng số đơn hàng phát sinh",
          value: `${totalOrders} đơn`,
          desc: "Nhu cầu thị trường",
          icon: TrendingUp,
          color: STATUS_THEME.INFO.textColor,
          bgColor: STATUS_THEME.INFO.bgColor,
        },
        {
          title: "Đơn hủy & hoàn kho",
          value: `${ordersStats.CANCELLED || 0} đơn`,
          desc: "Tự động hoàn lại kho",
          icon: RotateCcw,
          color: STATUS_THEME.WARNING.textColor,
          bgColor: STATUS_THEME.WARNING.bgColor,
        },
      ];
    }

    // Role Admin: Tổng quan toàn diện
    return [
      {
        title: "Doanh thu (Đơn thành công)",
        value: `${revenueTotal.toLocaleString("vi-VN")}₫`,
        desc: "Chỉ tính đơn DELIVERED",
        icon: TrendingUp,
        color: STATUS_THEME.SUCCESS.textColor,
        bgColor: STATUS_THEME.SUCCESS.bgColor,
      },
      {
        title: "Tổng số đơn hàng",
        value: `${totalOrders} đơn`,
        desc: `Đã giao: ${ordersStats.DELIVERED || 0} đơn`,
        icon: PackageCheck,
        color: STATUS_THEME.INFO.textColor,
        bgColor: STATUS_THEME.INFO.bgColor,
      },
      {
        title: "Đơn hàng chờ xử lý",
        value: `${(ordersStats.PENDING || 0) + (ordersStats.PREPARING || 0)} đơn`,
        desc: "Chờ tiếp nhận & đóng gói",
        icon: Clock,
        color: STATUS_THEME.WARNING.textColor,
        bgColor: STATUS_THEME.WARNING.bgColor,
      },
      {
        title: "Sản phẩm tồn kho thấp",
        value: `${lowStockProducts.length} SP`,
        desc: `Tồn kho ≤ ${threshold} cái`,
        icon: AlertTriangle,
        color: STATUS_THEME.DANGER.textColor,
        bgColor: STATUS_THEME.DANGER.bgColor,
      },
    ];
  }, [role, ordersStats, lowStockProducts.length, threshold, revenueTotal, totalOrders]);

  // Max revenue để tính chiều cao cột biểu đồ
  const maxRevenue = useMemo(() => {
    const max = Math.max(...revenueList.map((d) => d.amount), 1);
    return max;
  }, [revenueList]);

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút làm mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Báo cáo & Thống kê hệ thống
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Dữ liệu tổng hợp trực tiếp từ Backend (Doanh thu, Trạng thái đơn, Cảnh báo tồn kho).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchReportData();
            }}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* 1. Các thẻ chỉ số KPI hàng đầu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-xs hover:border-foreground/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">{card.title}</p>
                  <h3 className="text-2xl font-black text-foreground mt-2">{card.value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 stroke-[2]" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-medium text-muted-foreground">
                {card.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Phần thống kê đơn hàng theo trạng thái (GET /reports/orders) */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Phân bổ đơn hàng theo trạng thái (GET /reports/orders)
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Tổng số {totalOrders} đơn hàng được ghi nhận trong hệ thống
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(["PENDING", "PREPARING", "SHIPPING", "DELIVERED", "CANCELLED"] as const).map(
            (statusKey) => {
              const info = ORDER_STATUS_MAP[statusKey];
              const count = ordersStats[statusKey] || 0;
              const percent = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;

              return (
                <div
                  key={statusKey}
                  className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${info.badgeClass}`}>
                      {info.label}
                    </span>
                    <span className="text-[11px] font-bold text-muted-foreground">{percent}%</span>
                  </div>

                  <p className="text-2xl font-black text-foreground mt-1">{count} <span className="text-xs font-normal text-muted-foreground">đơn</span></p>

                  <div className="w-full bg-border rounded-full h-1.5 mt-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: info.color,
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* 3. Phần Báo cáo Doanh thu & Cảnh báo tồn kho thấp (2 cột) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột 1: Biểu đồ doanh thu (GET /reports/revenue) - Hiện cho Admin & Product Staff */}
        {(role === "admin" || role === "product_staff") && (
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <Calendar className={`w-4 h-4 ${STATUS_THEME.SUCCESS.textColor}`} />
                    <span>Doanh thu theo thời gian (GET /reports/revenue)</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chỉ tính các đơn hàng đã giao thành công (DELIVERED).
                  </p>
                </div>

                {/* Chọn ngày / tháng */}
                <div className="inline-flex rounded-xl border border-border bg-muted/50 p-0.5 text-xs">
                  <button
                    onClick={() => setGroupBy("day")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      groupBy === "day"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setGroupBy("month")}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                      groupBy === "month"
                        ? "bg-background text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Tháng
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-xs text-muted-foreground">Tổng doanh thu kỳ này:</span>
                <p className={`text-2xl font-black ${STATUS_THEME.SUCCESS.textColor}`}>
                  {revenueTotal.toLocaleString("vi-VN")}₫
                </p>
              </div>

              {/* Biểu đồ cột trực quan bằng CSS */}
              {revenueList.length === 0 ? (
                <div className="h-44 flex items-center justify-center text-xs text-muted-foreground">
                  Chưa có số liệu doanh thu trong khoảng thời gian này.
                </div>
              ) : (
                <div className="h-44 flex items-end gap-2 pt-6 pb-2">
                  {revenueList.map((item, index) => {
                    const heightPercent = Math.max(Math.round((item.amount / maxRevenue) * 100), 8);
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                      >
                        {/* Tooltip hiển thị khi hover */}
                        <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {(item.amount / 1000000).toFixed(1)}M
                        </span>
                        <div className="w-full bg-muted rounded-t-lg overflow-hidden flex items-end h-full">
                          <div
                            className="w-full bg-emerald-500/80 group-hover:bg-emerald-500 rounded-t-lg transition-all duration-300"
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-muted-foreground truncate w-full text-center">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Đơn vị tính: VNĐ</span>
              <span className="font-semibold text-foreground">API groupBy={groupBy}</span>
            </div>
          </div>
        )}

        {/* Cột 2: Cảnh báo sản phẩm sắp hết hàng (GET /reports/low-stock) */}
        <div className={`rounded-2xl border border-border bg-card p-6 flex flex-col justify-between ${
          role === "inventory_staff" ? "lg:col-span-2" : ""
        }`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <AlertTriangle className={`w-4 h-4 ${STATUS_THEME.DANGER.textColor}`} />
                  <span>Sản phẩm sắp hết hàng (GET /reports/low-stock)</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Cảnh báo mặt hàng có tồn kho thấp để lập kế hoạch nhập hàng hoặc ngừng kinh doanh.
                </p>
              </div>

              {/* Lựa chọn ngưỡng cảnh báo threshold */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="hidden sm:inline">Ngưỡng:</span>
                <select
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value={5}>≤ 5 cái</option>
                  <option value={10}>≤ 10 cái (Mặc định)</option>
                  <option value={20}>≤ 20 cái</option>
                </select>
              </div>
            </div>

            {/* Bảng danh sách sản phẩm tồn kho thấp */}
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                ✅ Không có sản phẩm nào có tồn kho thấp hơn ngưỡng {threshold}.
              </div>
            ) : (
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-3.5 py-2.5">Mã SKU</th>
                      <th className="px-3.5 py-2.5">Tên sản phẩm</th>
                      <th className="px-3.5 py-2.5">Danh mục</th>
                      <th className="px-3.5 py-2.5 text-right">Tồn kho</th>
                      <th className="px-3.5 py-2.5 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {lowStockProducts.slice(0, 5).map((p, idx) => {
                      const stockVal = p.stock ?? p.quantity ?? 0;
                      return (
                        <tr key={p.id || idx} className="hover:bg-muted/40 transition-colors">
                          <td className="px-3.5 py-2.5 font-mono font-bold text-foreground">
                            {p.sku || `SP-${p.id}`}
                          </td>
                          <td className="px-3.5 py-2.5 font-semibold text-foreground max-w-[160px] truncate">
                            {p.name || "Sản phẩm chưa đặt tên"}
                          </td>
                          <td className="px-3.5 py-2.5 text-muted-foreground">
                            {p.category || "--"}
                          </td>
                          <td className={`px-3.5 py-2.5 text-right font-black ${STATUS_THEME.DANGER.textColor}`}>
                            {stockVal} cái
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                stockVal === 0
                                  ? STATUS_THEME.DANGER.badgeClass
                                  : STATUS_THEME.WARNING.badgeClass
                              }`}
                            >
                              {stockVal === 0 ? "Hết hàng" : "Sắp hết"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border/50 text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Tổng cộng: {lowStockProducts.length} sản phẩm cần nhập thêm</span>
            <span className={`font-semibold ${STATUS_THEME.DANGER.textColor}`}>Threshold: {threshold}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
