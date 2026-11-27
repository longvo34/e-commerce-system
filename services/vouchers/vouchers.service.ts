import api from "../api";
import type { VoucherCheckResponse } from "@/types/voucher";

// GET /vouchers/check/{code}
// API công khai, kiểm tra mã giảm giá.
export function checkVoucher(code: string): Promise<VoucherCheckResponse> {
  return api.get<VoucherCheckResponse>(
    `/vouchers/check/${encodeURIComponent(code)}`,
  );
}
