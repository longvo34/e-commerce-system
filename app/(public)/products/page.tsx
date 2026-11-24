"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

import { getProducts } from "@/services/products";
import { getCategories } from "@/services/categories";

import type { Product, Category, ProductListResponse } from "@/types";

const LIMIT = 10;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryError, setCategoryError] = useState("");

  // GET /categories
  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const data = await getCategories({ status: "ACTIVE" });

        if (!cancelled) {
          setCategories(data);
        }
      } catch (err) {
        if (!cancelled) {
          setCategoryError(
            err instanceof Error ? err.message : "Không thể tải danh mục.",
          );
        }
      }
    }

    void loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  // GET /products
  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data: ProductListResponse = await getProducts({
          search: search || undefined,
          categoryId: categoryId || undefined,
          status: "ON_SALE",
          page,
          limit: LIMIT,
        });

        if (cancelled) return;

        setProducts(data.items);
        setTotal(data.total);
      } catch (err) {
        if (cancelled) return;

        setProducts([]);
        setError(
          err instanceof Error ? err.message : "Không thể tải sản phẩm.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [search, categoryId, page]);

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const totalPages = Math.ceil(total / LIMIT);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <main className="w-full bg-background py-8 text-foreground sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex gap-2 text-sm text-muted-foreground">
          <Link href="/">Trang chủ</Link>
          <span>/</span>
          <span className="font-medium text-foreground">Sản phẩm</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold sm:text-3xl">
            Khám phá sản phẩm
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm kiếm sản phẩm phù hợp với bạn
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-2 text-sm"
            />

            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Tìm kiếm
            </button>
          </form>

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-border bg-background px-4 py-2 text-sm"
            aria-label="Lọc danh mục"
          >
            <option value="">Tất cả danh mục</option>

            {categories.map((category) => (
              <option key={category.id} value={String(category.id)}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {categoryError && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            Không thể tải bộ lọc danh mục: {categoryError}
          </p>
        )}

        {/* Product List */}
        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            Đang tải sản phẩm...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 p-6 text-center text-destructive"
          >
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card py-20 text-center">
            <h2 className="text-lg font-semibold">Chưa có sản phẩm</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Không tìm thấy sản phẩm phù hợp.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-3"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="mb-3 flex aspect-square items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                      {product.imageUrl
                        ? "Xem ảnh sản phẩm ở trang chi tiết"
                        : "Chưa có ảnh"}
                    </div>
                  </Link>

                  <h2 className="mb-2 font-semibold">{product.productName}</h2>

                  <p className="mb-4 text-sm font-medium">
                    {formatPrice(product.price)}
                  </p>

                  <Link
                    href={`/products/${product.id}`}
                    className="mt-auto rounded-xl bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Trước
                </button>

                <span className="text-sm">
                  Trang {page} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
