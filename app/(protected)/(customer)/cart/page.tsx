"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCart,
  clearCart,
  updateCartItem,
  removeCartItem,
} from "@/services/cart";

interface CartItem {
  id: number;
  name?: string;
  price?: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  //const [subtotal, setSubtotal] = useState(0);

  const [clearing, setClearing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoading(true);
      setError("");

      try {
        const data = await getCart();

        if (cancelled) return;

        //setSubtotal(data.subtotal);

        if (data.items.length === 0) {
          setCartItems([]);
        } else {
          // Chưa xác định cấu trúc CartItem khi có sản phẩm.
          // Không tự ép kiểu dữ liệu backend.
          setCartItems([]);
          setError(
            "Giỏ hàng có sản phẩm nhưng chưa xác định được cấu trúc CartItem.",
          );
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err instanceof Error ? err.message : "Không thể tải giỏ hàng.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  //flag
  async function handleClearCart() {
    if (
      clearing ||
      updatingItemId !== null ||
      !window.confirm("Bạn muốn xóa toàn bộ giỏ hàng?")
    ) {
      return;
    }

    setClearing(true);
    setActionError("");

    try {
      await clearCart();
      setCartItems([]);
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể xóa giỏ hàng.",
      );
    } finally {
      setClearing(false);
    }
  }

  // PATCH /cart/items/{itemId}
  async function updateQuantity(
    id: number,
    currentQuantity: number,
    delta: number,
  ) {
    const newQuantity = currentQuantity + delta;

    if (newQuantity < 1 || updatingItemId !== null || clearing) {
      return;
    }

    setUpdatingItemId(id);
    setActionError("");

    try {
      await updateCartItem(id, { quantity: newQuantity });

      // GET lại giỏ hàng sau khi cập nhật thành công
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Không thể cập nhật số lượng sản phẩm.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  // DELETE /cart/items/{itemId}
  async function removeItem(id: number) {
    if (updatingItemId !== null || clearing) {
      return;
    }

    setUpdatingItemId(id);
    setActionError("");

    try {
      await removeCartItem(id);

      // GET lại giỏ hàng sau khi xóa thành công
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Không thể xóa sản phẩm.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <div className="w-full bg-background text-foreground py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <Link
            href="/products"
            className="mt-2.5 inline-block text-xs sm:text-sm text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
        {actionError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/30 p-4 text-sm text-destructive"
          >
            {actionError}
          </div>
        )}
        {loading ? (
          <div className="py-20 text-center">Đang tải giỏ hàng...</div>
        ) : error ? (
          <div className="py-20 text-center text-destructive" role="alert">
            {error}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-border bg-card">
            <p className="text-base font-semibold text-foreground">
              Giỏ hàng của bạn đang trống
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Hãy khám phá thêm sản phẩm để tiếp tục mua sắm.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div>
            {/* Cart Table Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs sm:text-sm font-semibold text-foreground">
                <div className="col-span-6 sm:col-span-5">Sản phẩm</div>
                <div className="hidden sm:block sm:col-span-2 text-center">
                  Đơn giá
                </div>
                <div className="col-span-3 sm:col-span-3 text-center">
                  Số lượng
                </div>
                <div className="col-span-3 sm:col-span-2 text-right">
                  Tổng cộng
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border/60">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 items-center py-6"
                  >
                    {/* Product Column */}
                    <div className="col-span-6 sm:col-span-5 flex items-center gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-muted border border-border/40 flex-shrink-0" />
                      <div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItemId !== null || clearing}
                          className="text-xs text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>

                    {/* Unit Price Column (placeholder) */}
                    <div className="hidden sm:block sm:col-span-2 text-center text-sm font-medium text-foreground">
                      {/* Price can be rendered here */}
                    </div>

                    {/* Quantity Stepper Column (+ 1 -) */}
                    <div className="col-span-3 sm:col-span-3 flex justify-center">
                      <div className="inline-flex items-center justify-between rounded-xl border border-border bg-background px-3 sm:px-4 py-2 min-w-[5.5rem] sm:min-w-[6.5rem]">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, 1)
                          }
                          disabled={updatingItemId !== null || clearing}
                          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity px-1"
                        >
                          +
                        </button>
                        <span className="text-sm font-medium text-foreground px-2">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity, -1)
                          }
                          disabled={
                            updatingItemId !== null ||
                            clearing ||
                            item.quantity <= 1
                          }
                          className="text-sm font-medium text-foreground hover:opacity-70 transition-opacity px-1"
                        >
                          -
                        </button>
                      </div>
                    </div>

                    {/* Total Price Column */}
                    <div className="col-span-3 sm:col-span-2 text-right text-sm font-medium text-foreground">
                      {/* Total price can be rendered here */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Summary & Checkout */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Tạm tính
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Thuế và phí giao hàng được tính ở bước tiếp theo
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={clearing || updatingItemId !== null}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted disabled:opacity-50"
                >
                  {clearing ? "Đang xóa..." : "Xóa toàn bộ"}
                </button>
                <Link
                  href="/profile-confirmation"
                  className="inline-block rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs text-center min-w-[8rem]"
                >
                  Thanh toán
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
