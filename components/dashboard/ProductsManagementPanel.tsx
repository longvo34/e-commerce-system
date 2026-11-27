"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  Power,
  RefreshCw,
  X,
  Upload,
  AlertCircle,
  Eye,
  CheckCircle,
  Check,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  discontinueProduct,
  resumeProduct,
  uploadProductImage,
  deleteProductImage,
} from "@/services/products";
import { getCategories } from "@/services/categories";
import { Product, Category, CreateProductPayload, UpdateProductPayload } from "@/types";
import { STATUS_THEME } from "@/constants";

export default function ProductsManagementPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // State cho thông báo lỗi / thành công
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // State cho Modal Thêm / Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Danh mục được chọn (Hỗ trợ nhiều danh mục qua categoryIds)
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    productName: "",
    skuCode: "",
    price: "",
    description: "",
    imageUrl: "",
  });

  // State cho Modal Upload Ảnh
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Tải danh sách sản phẩm
  const fetchProductsList = useCallback(async () => {
    try {
      setErrorMessage("");
      const res = await getProducts({
        search: search.trim() || undefined,
        status: statusFilter,
        page,
        limit,
      });

      if (res && Array.isArray(res.items)) {
        setProducts(res.items);
        setTotal(res.total ?? res.items.length);
      } else {
        setProducts([]);
        setTotal(0);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Không thể tải danh sách sản phẩm";
      setErrorMessage(msg);
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, statusFilter, page, limit]);

  useEffect(() => {
    fetchProductsList();
    // Load categories for dropdown
    getCategories()
      .then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) setCategories(cats);
      })
      .catch(() => {});
  }, [fetchProductsList]);

  // Thông báo biến mất sau 3 giây
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Chọn / bỏ chọn danh mục
  const toggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) => {
      if (prev.includes(catId)) {
        return prev.filter((id) => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  // Mở modal thêm mới
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    const activeCats = categories.filter((c) => c.status !== "INACTIVE");
    const defaultCat = activeCats.length > 0 ? activeCats[0].id : categories[0]?.id;
    setSelectedCategoryIds(defaultCat ? [defaultCat] : []);
    setFormData({
      productName: "",
      skuCode: "",
      price: "",
      description: "",
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    const existingCatIds: number[] =
      Array.isArray(product.categories) && product.categories.length > 0
        ? product.categories.map((c) => Number(c.id))
        : product.categoryId
        ? [Number(product.categoryId)]
        : categories.length > 0
        ? [categories[0].id]
        : [];

    setSelectedCategoryIds(Array.from(new Set(existingCatIds)));
    setFormData({
      productName: product.productName,
      skuCode: product.skuCode,
      price: String(product.price),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
    setIsModalOpen(true);
  };

  // Xử lý Lưu (Thêm hoặc Sửa)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const uniqueCatIds = Array.from(new Set(selectedCategoryIds.map(Number))).filter(
      (id) => !isNaN(id) && id > 0
    );

    if (uniqueCatIds.length === 0) {
      setErrorMessage("Sản phẩm phải thuộc ít nhất 1 danh mục. Vui lòng chọn danh mục bên dưới!");
      setSubmitting(false);
      return;
    }

    try {
      if (editingProduct) {
        // PATCH /products/{id}
        const payload: UpdateProductPayload = {
          productName: formData.productName.trim(),
          skuCode: formData.skuCode.trim(),
          price: Number(formData.price),
          categoryIds: uniqueCatIds,
          description: formData.description?.trim() || undefined,
          imageUrl: formData.imageUrl?.trim() || undefined,
        };
        await updateProduct(editingProduct.id, payload);
        setSuccessMessage(`Đã cập nhật sản phẩm "${formData.productName}"!`);
      } else {
        // POST /products
        const payload: CreateProductPayload = {
          productName: formData.productName.trim(),
          skuCode: formData.skuCode.trim(),
          price: Number(formData.price),
          categoryIds: uniqueCatIds,
          description: formData.description?.trim() || undefined,
          imageUrl: formData.imageUrl?.trim() || undefined,
        };
        await createProduct(payload);
        setSuccessMessage(`Đã tạo sản phẩm mới "${formData.productName}" thành công!`);
      }

      setIsModalOpen(false);
      fetchProductsList();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Thao tác thất bại. Vui lòng kiểm tra lại quyền hạn!"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Xử lý Ngừng kinh doanh hoặc Mở bán lại
  const handleToggleStatus = async (product: Product) => {
    try {
      if (product.status === "ON_SALE") {
        // PATCH /products/{id}/discontinue
        await discontinueProduct(product.id);
        setSuccessMessage(`Đã ngừng kinh doanh "${product.productName}"!`);
      } else {
        // PATCH /products/{id}/resume
        await resumeProduct(product.id);
        setSuccessMessage(`Đã mở bán lại "${product.productName}"!`);
      }
      fetchProductsList();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Không thể thay đổi trạng thái sản phẩm."
      );
    }
  };

  // Xử lý Xóa sản phẩm (DELETE /products/{id})
  const handleDeleteProduct = async (product: Product) => {
    const confirm = window.confirm(
      `Bạn có chắc chắn muốn xóa sản phẩm "${product.productName}"?\nLưu ý: Chỉ xóa được nếu sản phẩm chưa có đơn hàng hoặc lịch sử kho!`
    );
    if (!confirm) return;

    try {
      await deleteProduct(product.id);
      setSuccessMessage(`Đã xóa sản phẩm "${product.productName}" thành công!`);
      fetchProductsList();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Không thể xóa sản phẩm (có thể sản phẩm đã có lịch sử giao dịch)."
      );
    }
  };

  // Upload file ảnh (POST /products/{id}/image)
  const handleUploadImage = async () => {
    if (!imageModalProduct || !selectedFile) {
      alert("Vui lòng chọn 1 file ảnh hợp lệ!");
      return;
    }

    try {
      setUploadingImage(true);
      await uploadProductImage(imageModalProduct.id, selectedFile);
      setSuccessMessage(`Đã tải ảnh lên cho sản phẩm "${imageModalProduct.productName}"!`);
      setImageModalProduct(null);
      setSelectedFile(null);
      fetchProductsList();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Upload ảnh thất bại (chỉ nhận file ảnh ≤ 5MB)."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // Xóa file ảnh (DELETE /products/{id}/image)
  const handleDeleteImage = async (product: Product) => {
    if (!window.confirm(`Xóa ảnh của sản phẩm "${product.productName}"?`)) return;

    try {
      await deleteProductImage(product.id);
      setSuccessMessage("Đã xóa ảnh sản phẩm!");
      fetchProductsList();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Không thể xóa ảnh sản phẩm."
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Thông báo Alert */}
      {successMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${STATUS_THEME.SUCCESS.badgeClass}`}>
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className={`p-4 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${STATUS_THEME.DANGER.badgeClass}`}>
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Quản lý Sản phẩm & SKU (Products Management)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý mã SKU, giá bán, ngừng kinh doanh an toàn và upload hình ảnh sản phẩm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchProductsList();
            }}
            disabled={refreshing || loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc & Tìm kiếm */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border border-border bg-card">
        {/* Tìm theo tên */}
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tên sản phẩm hoặc mã SKU..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 rounded-xl text-xs text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        {/* Lọc trạng thái */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-muted/50 rounded-xl text-xs text-foreground font-semibold border border-border focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="ALL">Tất cả trạng thái (ALL)</option>
            <option value="ON_SALE">Đang kinh doanh (ON_SALE)</option>
            <option value="DISCONTINUED">Ngừng kinh doanh (DISCONTINUED)</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách sản phẩm (Table) */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Đang tải dữ liệu sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-muted-foreground">
            Không tìm thấy sản phẩm nào phù hợp.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase font-semibold text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Ảnh</th>
                  <th className="px-5 py-3.5">Mã SKU</th>
                  <th className="px-5 py-3.5">Tên sản phẩm</th>
                  <th className="px-5 py-3.5">Danh mục</th>
                  <th className="px-5 py-3.5">Giá bán</th>
                  <th className="px-5 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const isOnSale = p.status === "ON_SALE" || p.status === "Đang kinh doanh";
                  return (
                    <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                      {/* Cột Ảnh */}
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 rounded-lg bg-muted border border-border overflow-hidden flex items-center justify-center relative group">
                          {p.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={p.imageUrl.startsWith("http") ? p.imageUrl : `http://localhost:3000${p.imageUrl}`}
                              alt={p.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          )}
                          <button
                            onClick={() => setImageModalProduct(p)}
                            title="Quản lý ảnh"
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Mã SKU */}
                      <td className="px-5 py-3 font-mono font-bold text-foreground">
                        {p.skuCode}
                      </td>

                      {/* Tên sản phẩm */}
                      <td className="px-5 py-3">
                        <p className="font-semibold text-foreground max-w-xs truncate">
                          {p.productName}
                        </p>
                        {p.description && (
                          <p className="text-[11px] text-muted-foreground max-w-xs truncate mt-0.5">
                            {p.description}
                          </p>
                        )}
                      </td>

                      {/* Danh mục */}
                      <td className="px-5 py-3 text-muted-foreground">
                        {Array.isArray(p.categories) && p.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {p.categories.map((cat, catIdx) => (
                              <span
                                key={`prod-cat-${cat.id ?? catIdx}-${catIdx}`}
                                className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-foreground border border-border"
                              >
                                {cat.categoryName}
                              </span>
                            ))}
                          </div>
                        ) : p.category?.categoryName ? (
                          <span className="text-xs">{p.category.categoryName}</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Chưa phân loại</span>
                        )}
                      </td>

                      {/* Giá bán */}
                      <td className="px-5 py-3 font-semibold text-foreground">
                        {p.price ? `${p.price.toLocaleString("vi-VN")}₫` : "--"}
                      </td>

                      {/* Trạng thái */}
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isOnSale
                              ? STATUS_THEME.SUCCESS.badgeClass
                              : STATUS_THEME.MUTED.badgeClass
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isOnSale ? STATUS_THEME.SUCCESS.dotColor : STATUS_THEME.MUTED.dotColor
                            }`}
                          />
                          {isOnSale ? "Đang bán" : "Ngừng bán"}
                        </span>
                      </td>

                      {/* Các nút thao tác */}
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Sửa thông tin (PATCH /products/{id}) */}
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            title="Chỉnh sửa sản phẩm"
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quản lý ảnh (POST /products/{id}/image) */}
                          <button
                            onClick={() => setImageModalProduct(p)}
                            title="Tải ảnh lên"
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                          >
                            <ImageIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* Bật / Ngừng bán */}
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title={isOnSale ? "Ngừng kinh doanh" : "Mở bán lại"}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              isOnSale
                                ? STATUS_THEME.WARNING.outlineBtnClass
                                : STATUS_THEME.SUCCESS.outlineBtnClass
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Xóa (DELETE /products/{id}) */}
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            title="Xóa sản phẩm"
                            className={`p-1.5 rounded-lg border transition-colors ${STATUS_THEME.DANGER.outlineBtnClass}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer phân trang */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Tổng số: {total} sản phẩm</span>
          <span>Trang {page}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL THÊM / SỬA SẢN PHẨM */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-base text-foreground">
                {editingProduct ? `Chỉnh sửa sản phẩm #${editingProduct.id}` : "Thêm sản phẩm mới"}
              </h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: iPhone 15 Pro 256GB"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Mã SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: IP15P-256"
                    value={formData.skuCode}
                    onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 rounded-xl border border-border font-mono focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Giá bán (VNĐ) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Ví dụ: 29990000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-muted/50 rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold">
                    Danh mục sản phẩm (categoryIds) <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    Đã chọn: {selectedCategoryIds.length} danh mục
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Bấm chọn ít nhất 1 danh mục (hỗ trợ gán nhiều danh mục theo quan hệ N-N):
                </p>

                {categories.length === 0 ? (
                  <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    Chưa có danh mục nào trên hệ thống! Vui lòng tạo danh mục ở tab &quot;Danh mục sản phẩm&quot; trước.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-2.5 rounded-xl border border-border bg-muted/20">
                    {categories.map((c, idx) => {
                      const isSelected = selectedCategoryIds.includes(c.id);
                      const isInactive = c.status === "INACTIVE";
                      return (
                        <button
                          type="button"
                          key={`cat-pill-${c.id ?? idx}-${idx}`}
                          onClick={() => toggleCategory(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : isInactive
                              ? "bg-background/50 border-dashed border-border text-muted-foreground hover:bg-muted opacity-70"
                              : "bg-background border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          <span>{c.categoryName}</span>
                          <span
                            className={`text-[10px] font-normal ${
                              isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                            }`}
                          >
                            #{c.id} {isInactive ? "(Ngừng dùng)" : ""}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Mô tả sản phẩm</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chi tiết tính năng, thông số..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-muted/50 rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL UPLOAD / QUẢN LÝ ẢNH SẢN PHẨM */}
      {/* ========================================================================= */}
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h4 className="font-bold text-sm text-foreground">
                Quản lý ảnh: {imageModalProduct.productName}
              </h4>
              <button
                onClick={() => {
                  setImageModalProduct(null);
                  setSelectedFile(null);
                }}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Xem trước ảnh hiện tại */}
            <div className="text-xs space-y-2">
              <p className="font-semibold text-muted-foreground">Ảnh hiện tại:</p>
              <div className="w-full h-40 rounded-xl border border-border bg-muted/40 overflow-hidden flex items-center justify-center">
                {imageModalProduct.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      imageModalProduct.imageUrl.startsWith("http")
                        ? imageModalProduct.imageUrl
                        : `http://localhost:3000${imageModalProduct.imageUrl}`
                    }
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-muted-foreground">Chưa có ảnh</span>
                )}
              </div>

              {imageModalProduct.imageUrl && (
                <button
                  onClick={() => handleDeleteImage(imageModalProduct)}
                  className={`w-full py-1.5 rounded-lg border font-semibold transition-colors ${STATUS_THEME.DANGER.outlineBtnClass}`}
                >
                  Xóa ảnh hiện tại
                </button>
              )}
            </div>

            {/* Chọn file upload mới */}
            <div className="pt-3 border-t border-border text-xs space-y-2">
              <p className="font-semibold text-foreground">Tải ảnh mới lên (Tối đa 5MB):</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
              />

              <button
                type="button"
                disabled={!selectedFile || uploadingImage}
                onClick={handleUploadImage}
                className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-1.5 mt-3"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingImage ? "Đang tải lên..." : "Xác nhận tải ảnh"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
