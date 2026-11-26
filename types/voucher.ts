// GET /vouchers/check/{code}
export interface VoucherCheckResponse {
  valid: boolean;
  message: string;

  // Các trường bổ sung của Voucher hợp lệ
  // chưa được xác nhận từ backend.
  [key: string]: unknown;
}
