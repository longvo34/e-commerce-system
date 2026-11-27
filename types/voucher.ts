export type VoucherStatus = "ACTIVE" | "INACTIVE";

export interface VoucherItem {
  id: number;
  code: string;
  discountValue: number;
  conditions?: string;
  validFrom: string;
  validTo: string;
  status: VoucherStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateVoucherPayload {
  code: string;
  discountValue: number;
  conditions?: string;
  validFrom: string;
  validTo: string;
}

export interface UpdateVoucherPayload {
  code?: string;
  discountValue?: number;
  conditions?: string;
  validFrom?: string;
  validTo?: string;
}

// GET /vouchers/check/{code}
export interface VoucherCheckResponse {
  valid: boolean;
  message: string;
  voucher?: VoucherItem;
  [key: string]: unknown;
}
