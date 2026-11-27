"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Warehouse,
  ArrowDownToLine,
  ArrowUpFromLine,
  Scale,
  History,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  X,
  Package,
  Layers,
} from "lucide-react";
import {
  InventoryStock,
  InventoryHistoryItem,
  InventoryTransactionType,
  Product,
} from "@/types";
import {
  getAllStock,
  importInventory,
  exportInventory,
  adjustInventory,
  getInventoryHistory,
} from "@/services/inventory";
import { getProducts } from "@/services/products";
import { INVENTORY_TRANSACTION_MAP, STATUS_THEME, NOTIFICATION_THEME } from "@/constants";

export default function InventoryManagementPanel() {
  const [activeSubTab, setActiveSubTab] = useState<"stock" | "history">("stock");
  const [stocks, setStocks] = useState<InventoryStock[]>([]);
  const [history, setHistory] = useState<InventoryHistoryItem[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>("ALL");

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Modals
  const [activeModal, setActiveModal] = useState<"import" | "export" | "adjust" | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number>(1);
  const [formQuantity, setFormQuantity] = useState<number>(10);
  const [formReason, setFormReason] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Load products list for dropdown in modals
  useEffect(() => {
    getProducts({ limit: 100 })
      .then((res) => {
        if (res && Array.isArray(res.items) && res.items.length > 0) {
          setProductsList(res.items);
          setSelectedProductId(res.items[0].id);
        }
      })
      .catch(() => { });
  }, []);

  // Fetch Stock Data
  const fetchStockData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllStock();
      if (Array.isArray(data)) {
        setStocks(data);
      } else {
        setStocks([]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể tải số liệu tồn kho";
      showNotification("error", msg);
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch History Data
  const fetchHistoryData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInventoryHistory({
        type: historyTypeFilter === "ALL" ? undefined : (historyTypeFilter as InventoryTransactionType),
      });
      if (Array.isArray(data)) {
        setHistory(data);
      } else {
        setHistory([]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể tải lịch sử giao dịch kho";
      showNotification("error", msg);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [historyTypeFilter]);

  useEffect(() => {
    if (activeSubTab === "stock") {
      fetchStockData();
    } else {
      fetchHistoryData();
    }
  }, [activeSubTab, fetchStockData, fetchHistoryData]);

  // Open Modal with specific product
  const handleOpenModal = (modal: "import" | "export" | "adjust", prodId?: number) => {
    if (prodId) setSelectedProductId(prodId);
    setFormQuantity(10);
    setFormReason(
      modal === "import"
        ? "Nhập hàng từ nhà cung cấp"
        : modal === "export"
          ? "Xuất kho giao đơn hàng / điều chuyển"
          : "Kiểm kê định kỳ phát hiện sai lệch"
    );
    setActiveModal(modal);
  };

  // Handle Submit Form
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReason.trim()) {
      showNotification("error", "Vui lòng nhập lý do giao dịch");
      return;
    }
    if (formQuantity <= 0) {
      showNotification("error", "Số lượng phải lớn hơn 0");
      return;
    }

    setSubmitting(true);
    try {
      if (activeModal === "import") {
        await importInventory({
          productId: selectedProductId,
          quantity: Number(formQuantity),
          reason: formReason.trim(),
        });
        showNotification("success", `Nhập kho thành công (+${formQuantity})`);
      } else if (activeModal === "export") {
        await exportInventory({
          productId: selectedProductId,
          quantity: Number(formQuantity),
          reason: formReason.trim(),
        });
        showNotification("success", `Xuất kho thành công (-${formQuantity})`);
      } else if (activeModal === "adjust") {
        await adjustInventory({
          productId: selectedProductId,
          actualQuantity: Number(formQuantity),
          reason: formReason.trim(),
        });
        showNotification("success", `Đã cập nhật tồn kho thực tế thành ${formQuantity}`);
      }

      setActiveModal(null);
      fetchStockData();
      if (activeSubTab === "history") fetchHistoryData();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 400) {
        showNotification("error", "Lỗi: Số lượng xuất vượt quá tồn kho hiện có!");
      } else if (status === 403) {
        showNotification("error", "403 Forbidden: Chỉ INVENTORY_STAFF hoặc ADMIN mới có quyền thực hiện");
      } else {
        showNotification("error", msg || "Thao tác thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Stocks
  const filteredStocks = useMemo(() => {
    return stocks.filter((s) => {
      const name = (s.productName || "").toLowerCase();
      const sku = (s.skuCode || "").toLowerCase();
      const q = searchTerm.toLowerCase();
      return name.includes(q) || sku.includes(q) || String(s.productId).includes(q);
    });
  }, [stocks, searchTerm]);

  // Filtered History
  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      const name = (h.productName || "").toLowerCase();
      const sku = (h.skuCode || "").toLowerCase();
      const reason = (h.reason || "").toLowerCase();
      const q = searchTerm.toLowerCase();
      const matchSearch = name.includes(q) || sku.includes(q) || reason.includes(q);
      const matchType = historyTypeFilter === "ALL" || h.type === historyTypeFilter;
      return matchSearch && matchType;
    });
  }, [history, searchTerm, historyTypeFilter]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all border ${
            NOTIFICATION_THEME[notification.type] || STATUS_THEME.INFO.badgeClass
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-primary" />
              Quản lý kho hàng (Inventory Staff)
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              Role: INVENTORY_STAFF
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Theo dõi tồn kho sản phẩm, ghi nhận nhập kho, xuất kho và điều chỉnh kiểm kê định kỳ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => handleOpenModal("import")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors ${INVENTORY_TRANSACTION_MAP.IMPORT.btnClass}`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            + Nhập kho
          </button>

          <button
            onClick={() => handleOpenModal("export")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors ${INVENTORY_TRANSACTION_MAP.EXPORT.btnClass}`}
          >
            <ArrowUpFromLine className="w-4 h-4" />
            - Xuất kho
          </button>

          <button
            onClick={() => handleOpenModal("adjust")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-colors ${INVENTORY_TRANSACTION_MAP.ADJUSTMENT.btnClass}`}
          >
            <Scale className="w-4 h-4" />
            Kiểm kê
          </button>

          <button
            onClick={activeSubTab === "stock" ? fetchStockData : fetchHistoryData}
            disabled={loading}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
        </div>
      </div>

      {/* Sub Tabs: Tồn kho vs Lịch sử */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("stock")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeSubTab === "stock"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <Package className="w-4 h-4" />
            Tồn kho hiện tại (Stock)
          </button>

          <button
            onClick={() => setActiveSubTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeSubTab === "history"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
          >
            <History className="w-4 h-4" />
            Lịch sử nhập xuất (History)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm, SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
          />
        </div>
      </div>

      {/* TAB 1: TỒN KHO SẢN PHẨM */}
      {activeSubTab === "stock" && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Sản phẩm</th>
                  <th className="py-3 px-4">Mã SKU</th>
                  <th className="py-3 px-4 text-center">Tồn kho hiện tại</th>
                  <th className="py-3 px-4 text-center">Tổng nhập</th>
                  <th className="py-3 px-4 text-center">Tổng xuất</th>
                  <th className="py-3 px-4 text-right">Thao tác kho</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {loading ? (
                  <tr key="stock-table-loading">
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                      Đang tải số liệu tồn kho...
                    </td>
                  </tr>
                ) : filteredStocks.length === 0 ? (
                  <tr key="stock-table-empty">
                    <td colSpan={6} className="py-12 text-center text-muted-foreground">
                      Không tìm thấy dữ liệu tồn kho phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredStocks.map((s, idx) => {
                    const prodId = s.productId ?? (s as any).id ?? idx;
                    const itemKey = `stock-${prodId}-${idx}`;
                    const isOutOfStock = (s.stock ?? 0) <= 0;
                    const isLowStock = (s.stock ?? 0) > 0 && (s.stock ?? 0) <= 10;
                    const productName = s.productName || (s as any).name || (s as any).product?.name || `Sản phẩm #${prodId}`;
                    const sku = s.skuCode || (s as any).sku || "—";

                    return (
                      <tr key={itemKey} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-foreground">
                            {productName}
                          </p>
                          <span className="text-[11px] text-muted-foreground">ID: #{prodId}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-muted-foreground">
                          {sku}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block font-bold px-2.5 py-1 rounded-full text-xs border ${
                              isOutOfStock
                                ? STATUS_THEME.DANGER.badgeClass
                                : isLowStock
                                ? STATUS_THEME.WARNING.badgeClass
                                : STATUS_THEME.SUCCESS.badgeClass
                            }`}
                          >
                            {s.stock ?? 0} cái
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 text-center font-medium ${STATUS_THEME.SUCCESS.textColor}`}>
                          +{s.totalImport ?? "—"}
                        </td>
                        <td className={`py-3.5 px-4 text-center font-medium ${STATUS_THEME.DANGER.textColor}`}>
                          -{s.totalExport ?? "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenModal("import", Number(prodId))}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${INVENTORY_TRANSACTION_MAP.IMPORT.outlineBtnClass}`}
                              title="Nhập thêm hàng"
                            >
                              + Nhập
                            </button>
                            <button
                              onClick={() => handleOpenModal("export", Number(prodId))}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${INVENTORY_TRANSACTION_MAP.EXPORT.outlineBtnClass}`}
                              title="Xuất bớt hàng"
                            >
                              - Xuất
                            </button>
                            <button
                              onClick={() => handleOpenModal("adjust", Number(prodId))}
                              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-colors ${INVENTORY_TRANSACTION_MAP.ADJUSTMENT.outlineBtnClass}`}
                              title="Kiểm kê điều chỉnh"
                            >
                              Kiểm kê
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LỊCH SỬ GIAO DỊCH KHO */}
      {activeSubTab === "history" && (
        <div className="space-y-4">
          {/* History Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "ALL", label: "Tất cả giao dịch" },
              { id: "IMPORT", label: "📥 Nhập kho" },
              { id: "EXPORT", label: "📤 Xuất kho" },
              { id: "ADJUSTMENT", label: "⚖️ Điều chỉnh kiểm kê" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setHistoryTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${historyTypeFilter === tab.id
                  ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Mã GD</th>
                    <th className="py-3 px-4">Loại giao dịch</th>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4 text-center">Số lượng</th>
                    <th className="py-3 px-4">Nhân viên thực hiện</th>
                    <th className="py-3 px-4">Lý do / Ghi chú</th>
                    <th className="py-3 px-4 text-right">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {loading ? (
                    <tr key="history-table-loading">
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                        Đang tải lịch sử giao dịch kho...
                      </td>
                    </tr>
                  ) : filteredHistory.length === 0 ? (
                    <tr key="history-table-empty">
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        Không có bản ghi giao dịch nào.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((h, idx) => {
                      const typeMeta = INVENTORY_TRANSACTION_MAP[h.type] || {
                        label: h.type,
                        badgeClass: "bg-muted text-muted-foreground",
                        prefix: "",
                      };

                      return (
                        <tr key={`history-${h.id ?? idx}-${idx}`} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                            #{h.id || idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${typeMeta.badgeClass}`}
                            >
                              {typeMeta.label}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-foreground">
                              {h.productName || `Sản phẩm #${h.productId}`}
                            </p>
                            {h.skuCode && (
                              <span className="text-[11px] text-muted-foreground font-mono">
                                SKU: {h.skuCode}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-foreground">
                            {typeMeta.prefix}
                            {h.quantity}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {h.staffName || (h.staffId ? `Staff #${h.staffId}` : "Hệ thống")}
                          </td>
                          <td className="py-3 px-4 text-foreground/80 max-w-xs truncate">
                            {h.reason || "—"}
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground text-[11px]">
                            {h.createdAt || "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nhập kho / Xuất kho / Kiểm kê */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                {activeModal === "import" && (
                  <>
                    <ArrowDownToLine className={`w-5 h-5 ${STATUS_THEME.SUCCESS.textColor}`} />
                    Tạo phiếu Nhập kho
                  </>
                )}
                {activeModal === "export" && (
                  <>
                    <ArrowUpFromLine className={`w-5 h-5 ${STATUS_THEME.DANGER.textColor}`} />
                    Tạo phiếu Xuất kho
                  </>
                )}
                {activeModal === "adjust" && (
                  <>
                    <Scale className={`w-5 h-5 ${STATUS_THEME.INFO.textColor}`} />
                    Điều chỉnh tồn kho sau kiểm kê
                  </>
                )}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Sản phẩm <span className={STATUS_THEME.DANGER.textColor}>*</span>
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  {productsList.length > 0 ? (
                    productsList.map((p, idx) => (
                      <option key={`prod-opt-${p.id ?? idx}`} value={p.id}>
                        {p.productName} ({p.skuCode || "—"}) - ID #{p.id}
                      </option>
                    ))
                  ) : (
                    stocks.map((s, idx) => {
                      const pId = s.productId ?? (s as any).id ?? idx;
                      return (
                        <option key={`stock-opt-${pId}-${idx}`} value={pId}>
                          {s.productName || (s as any).name || `Sản phẩm #${pId}`} - ID #{pId}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  {activeModal === "adjust"
                    ? "Số lượng thực tế đếm được *"
                    : "Số lượng giao dịch *"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formQuantity}
                  onChange={(e) => setFormQuantity(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
                {activeModal === "export" && (
                  <p className={`text-[11px] mt-1 ${STATUS_THEME.DANGER.textColor}`}>
                    Lưu ý: Không được xuất vượt quá số lượng tồn kho hiện có.
                  </p>
                )}
                {activeModal === "adjust" && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Hệ thống sẽ tự tính phần lệch và ghi bút toán ADJUSTMENT.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Lý do / Ghi chú <span className={STATUS_THEME.DANGER.textColor}>*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Nhập hàng nhà cung cấp, xuất đơn hàng, hỏng rách sau kiểm kê..."
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 ${
                    activeModal === "import"
                      ? INVENTORY_TRANSACTION_MAP.IMPORT.btnClass
                      : activeModal === "export"
                      ? INVENTORY_TRANSACTION_MAP.EXPORT.btnClass
                      : INVENTORY_TRANSACTION_MAP.ADJUSTMENT.btnClass
                  }`}
                >
                  {submitting ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
