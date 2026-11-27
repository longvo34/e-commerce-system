import api from "../api";
import {
  RegisterPayload,
  RegisterResponse,
  VerifyEmailPayload,
  ResendOtpPayload,
  ResendOtpResponse,
} from "@/types";

/**
 * 1. POST /auth/register - Đăng ký tài khoản khách hàng (gửi mã OTP xác thực email)
 */
export async function register(
  data: RegisterPayload
): Promise<RegisterResponse> {
  return await api.post<RegisterResponse>("/auth/register", data);
}

/**
 * 2. POST /auth/verify-email - Xác thực email bằng mã OTP 6 số
 */
export async function verifyEmail(
  data: VerifyEmailPayload
): Promise<{ message: string }> {
  return await api.post<{ message: string }>("/auth/verify-email", data);
}

/**
 * 3. POST /auth/resend-otp - Gửi lại mã OTP xác thực email (cách nhau tối thiểu 60s)
 */
export async function resendOtp(
  data: ResendOtpPayload
): Promise<ResendOtpResponse> {
  return await api.post<ResendOtpResponse>("/auth/resend-otp", data);
}
