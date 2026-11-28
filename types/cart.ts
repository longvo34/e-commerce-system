export interface AddCartItemPayload {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export type CartItemId = number;

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    productName: string;
    skuCode: string;
    price: string;
    imageUrl: string;
    status: string;
  };
}

export interface CartResponse {
  cartId: number;
  items: CartItem[];
  subtotal: number;
}
