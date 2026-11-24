export interface AddCartItemPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export type CartItemId = number;

export interface CartResponse {
  cartId: number;
  items: unknown[];
  subtotal: number;
}
