import api from "../api";
import type {
  ShippingFeeResponse,
  UpdateShippingFeePayload,
} from "@/types/settings";

/**
 * [Public] GET /settings/shipping-fee
 * Xem phí vận chuyển đang áp dụng 
 */
export function getShippingFee(): Promise<ShippingFeeResponse> {
  return api.get<ShippingFeeResponse>("/settings/shipping-fee");
}

/**
 * [Admin] PUT /settings/shipping-fee
 * Cấu hình phí vận chuyển 
 * @param payload 
 */
export function updateShippingFee(
  payload: UpdateShippingFeePayload
): Promise<ShippingFeeResponse> {
  return api.put<ShippingFeeResponse>("/settings/shipping-fee", payload);
}
