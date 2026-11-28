"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { getProductById } from "@/services/products";
import { getCategoryById } from "@/services/categories";
import { addCartItem } from "@/services/cart";
import type { Product, Category } from "@/types";

function ProductDetailContent() {
  const params = useParams();
  const id = params.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setCategory(null);

      const productId = Number(id);

      if (
        typeof id !== "string" ||
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        setError("ID sản phẩm không hợp lệ.");
        setLoading(false);
        return;
      }

      try {
        // GET /products/{id}
        const productData = await getProductById(productId);

        if (cancelled) return;

        setProduct(productData);

        // GET /categories/{id}
        // Chỉ gọi khi Product có categoryId hợp lệ.
        const categoryId = Number(productData.categoryId);

        if (
          productData.categoryId != null &&
          Number.isSafeInteger(categoryId) &&
          categoryId > 0
        ) {
          try {
            const categoryData = await getCategoryById(categoryId);

            if (!cancelled) {
              setCategory(categoryData);
            }
          } catch (categoryError) {
            // Không làm lỗi toàn trang nếu chỉ thiếu danh mục.
            console.error("Không thể tải danh mục sản phẩm:", categoryError);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Không thể tải chi tiết sản phẩm.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);
  async function handleAddToCart() {
    if (!product || addingToCart) return;

    setCartError("");
    setCartMessage("");
    setAddedToCart(false);

    if (product.status !== "ON_SALE") {
      setCartError("Sản phẩm hiện không được bán.");
      return;
    }

    if (product.stock != null && product.stock <= 0) {
      setCartError("Sản phẩm đã hết hàng.");
      return;
    }

    setAddingToCart(true);

    try {
      await addCartItem({
        productId: product.id,
        quantity: 1,
      });

      setAddedToCart(true);
      setCartMessage("Đã thêm sản phẩm vào giỏ hàng.");
    } catch (err) {
      setCartError(
        err instanceof Error
          ? err.message
          : "Không thể thêm sản phẩm vào giỏ hàng.",
      );
    } finally {
      setAddingToCart(false);
    }
  }
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Đang tải chi tiết sản phẩm...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Không thể hiển thị sản phẩm</h1>

        <p role="alert" className="mt-3 text-muted-foreground">
          {error || "Không tìm thấy thông tin sản phẩm."}
        </p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Quay lại danh sách sản phẩm
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full bg-background py-8 text-foreground sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <Link href="/products">Sản phẩm</Link>
          <span>/</span>
          <span className="font-medium text-foreground">
            {product.productName}
          </span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* Product image area */}
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-muted">
            <p className="text-sm text-muted-foreground">
              {product.imageUrl
                ? "Ảnh sản phẩm sẽ được tích hợp sau"
                : "Sản phẩm chưa có ảnh"}
            </p>
          </div>

          {/* Product information */}
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {product.productName}
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              SKU: {product.skuCode}
            </p>

            <p className="mt-5 text-3xl font-bold">
              {formatPrice(product.price)}
            </p>

            <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="font-medium">
                  {product.status === "ON_SALE"
                    ? "Đang bán"
                    : product.status === "DISCONTINUED"
                      ? "Ngừng kinh doanh"
                      : product.status}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Danh mục</span>
                <span className="font-medium">
                  {category?.categoryName ||
                    product.category?.categoryName ||
                    (product.categoryId != null
                      ? `Danh mục #${product.categoryId}`
                      : "Chưa có thông tin")}
                </span>
              </div>

              {product.stock != null && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Tồn kho</span>
                  <span className="font-medium">{product.stock}</span>
                </div>
              )}

              {product.rating != null && (
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Đánh giá</span>
                  <span className="font-medium">{product.rating}</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => void handleAddToCart()}
                disabled={
                  addingToCart ||
                  product.status !== "ON_SALE" ||
                  (product.stock != null && product.stock <= 0)
                }
                className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {addingToCart
                  ? "Đang thêm..."
                  : product.status !== "ON_SALE"
                    ? "Sản phẩm ngừng bán"
                    : product.stock != null && product.stock <= 0
                      ? "Hết hàng"
                      : "Thêm vào giỏ hàng"}
              </button>

              {cartError && (
                <p role="alert" className="text-sm text-destructive">
                  {cartError}
                </p>
              )}

              {cartMessage && (
                <p role="status" className="text-sm text-foreground">
                  {cartMessage}
                </p>
              )}

              {addedToCart && (
                <Link
                  href="/cart"
                  className="inline-block text-sm font-medium text-foreground underline underline-offset-4"
                >
                  Xem giỏ hàng
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mt-12 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Mô tả sản phẩm</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">
            {product.description || "Chưa có mô tả sản phẩm."}
          </p>
        </section>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-20 text-center">
          <p className="text-muted-foreground">Đang tải chi tiết sản phẩm...</p>
        </main>
      }
    >
      <ProductDetailContent />
    </Suspense>
  );
}
