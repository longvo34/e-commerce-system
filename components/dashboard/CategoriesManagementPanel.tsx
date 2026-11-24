"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FolderTree,
  Plus,
  RefreshCw,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  PowerOff,
  FolderOpen,
} from "lucide-react";
import { Category, CategoryStatus } from "@/types";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  deactivateCategory,
} from "@/services/categories";
import { CATEGORY_STATUS_MAP } from "@/constants";

const MOCK_CATEGORIES: Category[] = [
  { id: 1, categoryName: "Điện thoại & Tablet", status: "ACTIVE", productCount: 42 },
  { id: 2, categoryName: "Laptop & Máy tính", status: "ACTIVE", productCount: 28 },
  { id: 3, categoryName: "Phụ kiện công nghệ", status: "ACTIVE", productCount: 15 },
  { id: 4, categoryName: "Đồng hồ thông minh", status: "INACTIVE", productCount: 0 },
];

export default function CategoriesManagementPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({ categoryName: "" });
  const [editForm, setEditForm] = useState({
    categoryName: "",
    status: "ACTIVE" as CategoryStatus,
  });

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCategories({
        status: statusFilter === "ALL" ? undefined : (statusFilter as CategoryStatus),
      });
      if (Array.isArray(data) && data.length > 0) {
        setCategories(data);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể tải danh mục";
      if (err?.response?.status === 403) {
        showNotification(
          "info",
          "Tài khoản hiện tại không có quyền PRODUCT_STAFF để đồng bộ danh mục. Đang hiển thị dữ liệu mẫu để bạn thao tác thử nghiệm."
        );
      } else {
        showNotification("error", msg);
      }
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Add Category
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.categoryName.trim()) {
      showNotification("error", "Vui lòng nhập tên danh mục");
      return;
    }

    setSubmitting(true);
    try {
      await createCategory({
        categoryName: addForm.categoryName.trim(),
      });
      showNotification("success", `Đã thêm danh mục "${addForm.categoryName}" thành công!`);
      setIsAddModalOpen(false);
      setAddForm({ categoryName: "" });
      fetchCategories();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 403) {
        showNotification("error", "403 Forbidden: Chỉ PRODUCT_STAFF hoặc ADMIN mới có quyền thêm danh mục");
      } else if (status === 409) {
        showNotification("error", "409 Conflict: Tên danh mục đã tồn tại trong hệ thống");
      } else {
        showNotification("error", msg || "Thêm danh mục thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setEditForm({
      categoryName: cat.categoryName,
      status: (cat.status as CategoryStatus) || "ACTIVE",
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Category
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    if (!editForm.categoryName.trim()) {
      showNotification("error", "Vui lòng nhập tên danh mục");
      return;
    }

    setSubmitting(true);
    try {
      await updateCategory(selectedCategory.id, {
        categoryName: editForm.categoryName.trim(),
        status: editForm.status,
      });
      showNotification("success", `Cập nhật danh mục "${editForm.categoryName}" thành công!`);
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 403) {
        showNotification("error", "403 Forbidden: Chỉ PRODUCT_STAFF hoặc ADMIN mới có quyền sửa danh mục");
      } else if (status === 404) {
        showNotification("error", "Không tìm thấy danh mục để chỉnh sửa");
      } else {
        showNotification("error", msg || "Cập nhật danh mục thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Deactivate
  const handleDeactivate = async (cat: Category) => {
    if (!confirm(`Bạn có chắc muốn ngừng sử dụng danh mục "${cat.categoryName}" không?`)) {
      return;
    }

    try {
      await deactivateCategory(cat.id);
      showNotification("success", `Đã ngừng sử dụng danh mục "${cat.categoryName}"`);
      fetchCategories();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 403) {
        showNotification("error", "403 Forbidden: Chỉ PRODUCT_STAFF hoặc ADMIN mới có quyền thao tác");
      } else {
        showNotification("error", msg || "Không thể ngừng sử dụng danh mục");
      }
    }
  };

  // Handle Delete Category
  const handleDelete = async (cat: Category) => {
    if (
      !confirm(
        `Bạn có chắc muốn xóa vĩnh viễn danh mục "${cat.categoryName}"?\nLưu ý: Chỉ xóa được khi danh mục không còn sản phẩm nào liên kết.`
      )
    ) {
      return;
    }

    try {
      await deleteCategory(cat.id);
      showNotification("success", `Đã xóa danh mục "${cat.categoryName}" thành công!`);
      fetchCategories();
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message;
      if (status === 400) {
        showNotification("error", "Không thể xóa: Danh mục vẫn còn sản phẩm liên kết!");
      } else if (status === 403) {
        showNotification("error", "403 Forbidden: Chỉ PRODUCT_STAFF hoặc ADMIN mới có quyền xóa");
      } else if (status === 404) {
        showNotification("error", "Không tìm thấy danh mục để xóa");
      } else {
        showNotification("error", msg || "Xóa danh mục thất bại");
      }
    }
  };

  // Filter local categories by search
  const filteredCategories = categories.filter((c) => {
    const matchSearch =
      searchTerm === "" ||
      c.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(c.id).includes(searchTerm);
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all border ${
            notification.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              : notification.type === "error"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
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
              <FolderTree className="w-5 h-5 text-primary" />
              Danh mục sản phẩm (Categories)
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              Role: PRODUCT_STAFF
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý cây danh mục sản phẩm. Thêm, sửa, ngừng sử dụng hoặc xóa (khi không còn sản phẩm liên kết).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            disabled={loading}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Status Tab buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "ACTIVE", label: "Đang sử dụng" },
            { id: "INACTIVE", label: "Ngừng sử dụng" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background border border-border focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
          <p className="text-xs">Đang tải danh mục từ máy chủ...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/50">
          <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-foreground">Không tìm thấy danh mục nào</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchTerm ? "Thử thay đổi từ khóa tìm kiếm" : "Hãy bấm nút \"+ Thêm danh mục\" để bắt đầu"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((c) => {
            const statusMeta = CATEGORY_STATUS_MAP[c.status || "ACTIVE"] || {
              label: c.status || "Chưa xác định",
              badgeClass: "bg-muted text-muted-foreground border-border",
            };

            return (
              <div
                key={c.id}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-medium text-muted-foreground px-2 py-0.5 rounded-md bg-muted border border-border/50">
                      ID: #{c.id}
                    </span>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${statusMeta.badgeClass}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-foreground mt-3 group-hover:text-primary transition-colors">
                    {c.categoryName}
                  </h4>

                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" />
                    {c.productCount !== undefined
                      ? `${c.productCount} sản phẩm liên kết`
                      : "Sẵn sàng phân loại sản phẩm"}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                      title="Chỉnh sửa danh mục"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                      Sửa
                    </button>
                    {c.status !== "INACTIVE" && (
                      <button
                        onClick={() => handleDeactivate(c)}
                        className="p-1.5 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-medium"
                        title="Ngừng sử dụng"
                      >
                        <PowerOff className="w-3.5 h-3.5 text-amber-500" />
                        Ngừng
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(c)}
                    className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Xóa danh mục (chỉ khi không có sản phẩm liên kết)"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Thêm danh mục */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                Thêm danh mục mới
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Điện thoại, Laptop, Áo sơ mi..."
                  value={addForm.categoryName}
                  onChange={(e) => setAddForm({ categoryName: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  API: <code>POST /categories</code> (Yêu cầu role PRODUCT_STAFF/ADMIN)
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
                >
                  {submitting ? "Đang lưu..." : "Tạo danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Chỉnh sửa danh mục */}
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                Chỉnh sửa danh mục #{selectedCategory.id}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Tên danh mục <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editForm.categoryName}
                  onChange={(e) => setEditForm({ ...editForm, categoryName: e.target.value })}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Trạng thái danh mục</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value as CategoryStatus })}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="ACTIVE">ACTIVE - Đang sử dụng</option>
                  <option value="INACTIVE">INACTIVE - Ngừng sử dụng</option>
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  API: <code>PATCH /categories/{selectedCategory.id}</code>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5"
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
