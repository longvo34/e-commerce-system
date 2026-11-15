"use client";

import { useMemo, useState } from "react";
import { Package, Search, ChevronDown, ChevronUp } from "lucide-react";

type OrderStatus =
  | "Pending"
  | "Preparing"
  | "Shipping"
  | "Delivered"
  | "Cancelled";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  cancelReason?: string;
  items: OrderItem[];
};

// Mock data - thay bằng API khi có backend
const orders: Order[] = [
  {
    id: "ORD-1004",
    createdAt: "14/11/2026",
    status: "Pending",
    shippingAddress: "TP. Hồ Chí Minh",
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    shippingFee: 30000,
    discountAmount: 30000,
    totalAmount: 350000,
    items: [{ id: 1, name: "Áo thun basic", quantity: 2, unitPrice: 175000 }],
  },
  {
    id: "ORD-1003",
    createdAt: "12/11/2026",
    status: "Shipping",
    shippingAddress: "TP. Hồ Chí Minh",
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    shippingFee: 30000,
    discountAmount: 0,
    totalAmount: 480000,
    items: [{ id: 2, name: "Quần jeans", quantity: 1, unitPrice: 450000 }],
  },
  {
    id: "ORD-1002",
    createdAt: "10/11/2026",
    status: "Delivered",
    shippingAddress: "TP. Hồ Chí Minh",
    paymentMethod: "COD",
    paymentStatus: "Đã thanh toán",
    shippingFee: 20000,
    discountAmount: 50000,
    totalAmount: 620000,
    items: [{ id: 3, name: "Giày sneaker", quantity: 1, unitPrice: 650000 }],
  },
  {
    id: "ORD-1001",
    createdAt: "08/11/2026",
    status: "Cancelled",
    shippingAddress: "TP. Hồ Chí Minh",
    paymentMethod: "COD",
    paymentStatus: "Chưa thanh toán",
    shippingFee: 30000,
    discountAmount: 0,
    totalAmount: 350000,
    cancelReason: "Khách hàng thay đổi nhu cầu",
    items: [{ id: 4, name: "Balo", quantity: 1, unitPrice: 320000 }],
  },
];

const statusLabels: Record<OrderStatus, string> = {
  Pending: "Chờ xác nhận",
  Preparing: "Đang chuẩn bị",
  Shipping: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

const filters = [
  { value: "All", label: "Tất cả" },
  { value: "Pending", label: "Chờ xác nhận" },
  { value: "Preparing", label: "Đang chuẩn bị" },
  { value: "Shipping", label: "Đang giao" },
  { value: "Delivered", label: "Đã giao" },
  { value: "Cancelled", label: "Đã hủy" },
] as const;

type Filter = (typeof filters)[number]["value"];

const currency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

export default function OrderHistoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return orders.filter((order) => {
      const statusMatch = filter === "All" || order.status === filter;

      const searchMatch =
        order.id.toLowerCase().includes(keyword) ||
        order.items.some((item) => item.name.toLowerCase().includes(keyword));

      return statusMatch && searchMatch;
    });
  }, [search, filter]);

  return (
    <div className="bg-background px-4 py-10 text-foreground">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Theo dõi trạng thái và lịch sử mua hàng
        </p>

        <div className="relative mt-8">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            aria-label="Tìm kiếm đơn hàng"
            type="search"
            placeholder="Tìm theo mã đơn hoặc sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-input bg-card py-3 pl-12 pr-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="my-6 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={filter === item.value}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                filter === item.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card hover:bg-muted"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          {filteredOrders.length} đơn hàng
        </p>

        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const isExpanded = expanded === order.id;

            const subtotal = order.items.reduce(
              (sum, item) => sum + item.unitPrice * item.quantity,
              0,
            );

            return (
              <article
                key={order.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
                  <div>
                    <h2 className="font-semibold">#{order.id}</h2>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt}
                    </p>
                  </div>

                  <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
                    {statusLabels[order.status]}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary">
                        <Package className="text-secondary-foreground" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Số lượng: {item.quantity}
                        </p>
                      </div>

                      <p className="text-sm font-semibold">
                        {currency(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-5">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tổng thanh toán
                    </p>
                    <p className="text-lg font-bold">
                      {currency(order.totalAmount)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                    aria-expanded={isExpanded}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                  >
                    {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                    {isExpanded ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-3 border-t border-border bg-muted/30 p-5 text-sm">
                    <h3 className="font-semibold">Chi tiết đơn hàng</h3>

                    <p>Địa chỉ: {order.shippingAddress}</p>
                    <p>Phương thức thanh toán: {order.paymentMethod}</p>
                    <p>Trạng thái thanh toán: {order.paymentStatus}</p>

                    <div className="space-y-2 border-t border-border pt-3">
                      <div className="flex justify-between">
                        <span>Tiền hàng</span>
                        <span>{currency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phí vận chuyển</span>
                        <span>{currency(order.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Giảm giá</span>
                        <span>-{currency(order.discountAmount)}</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-3 font-bold">
                        <span>Tổng thanh toán</span>
                        <span>{currency(order.totalAmount)}</span>
                      </div>
                    </div>

                    {order.cancelReason && (
                      <p className="text-muted-foreground">
                        Lý do hủy: {order.cancelReason}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium">Không tìm thấy đơn hàng</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Hãy thử tìm kiếm hoặc chọn trạng thái khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("All");
              }}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
