import api from "../api";

import type {
  AddCartItemPayload,
  UpdateCartItemPayload,
  CartItemId,
  CartResponse,
} from "@/types/cart";

// GET /cart
export function getCart(): Promise<CartResponse> {
  return api.get("/cart");
}

// DELETE /cart
export function clearCart(): Promise<unknown> {
  return api.delete("/cart");
}

// POST /cart/items
export function addCartItem(data: AddCartItemPayload): Promise<unknown> {
  return api.post("/cart/items", data);
}

// PATCH /cart/items/{itemId}
export function updateCartItem(
  itemId: CartItemId,
  data: UpdateCartItemPayload,
): Promise<unknown> {
  return api.patch(`/cart/items/${itemId}`, data);
}

// DELETE /cart/items/{itemId}
export function removeCartItem(itemId: CartItemId): Promise<unknown> {
  return api.delete(`/cart/items/${itemId}`);
}
