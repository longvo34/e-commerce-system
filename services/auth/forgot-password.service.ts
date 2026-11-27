import api from "../api";
import {
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  ResetPasswordPayload,
} from "@/types";

/**
 * 1. POST /auth/forgot-password - Quên mật khẩu, gửi mã OTP đặt lại mật khẩu
 */
export async function forgotPassword(
  data: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
  return await api.post<ForgotPasswordResponse>("/auth/forgot-password", data);
}

/**
 * 2. POST /auth/reset-password - Đặt lại mật khẩu bằng mã OTP
 */
export async function resetPassword(
  data: ResetPasswordPayload
): Promise<{ message: string }> {
  return await api.post<{ message: string }>("/auth/reset-password", data);
}
