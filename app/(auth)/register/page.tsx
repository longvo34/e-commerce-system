"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, KeyRound, ArrowLeft, RefreshCw, CheckCircle2 } from "lucide-react";
import { register, verifyEmail, resendOtp } from "@/services/auth";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Email verification states
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Timer cho resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "verify" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Xử lý gửi Form Đăng ký (Bước 1)
  async function handleRegisterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phoneNumber = String(formData.get("phone") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      const res = await register({
        fullName,
        email,
        phoneNumber,
        password,
        address,
      });

      setRegisteredEmail(email);
      setDevOtp(res?.devOtp || null);
      setResendCooldown(60);
      setStep("verify");
      // setMessage(
      //   res?.message ||
      //     `Đã gửi mã OTP gồm 6 số tới ${email}. Vui lòng nhập mã để hoàn tất đăng ký!`
      // );
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại. Vui lòng thử lại!";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Xử lý Xác thực OTP (Bước 2)
  async function handleVerifySubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyEmail({
        email: registeredEmail,
        otp: cleanOtp,
      });

      setMessage(res?.message || "Xác thực email thành công! Đang chuyển đến trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Mã OTP sai, hết hạn, hoặc email đã được xác thực trước đó.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Xử lý Gửi lại mã OTP
  async function handleResendOtp() {
    if (resendCooldown > 0 || isResending) return;
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      const res = await resendOtp({ email: registeredEmail });
      setDevOtp(res?.devOtp || null);
      setResendCooldown(60);
      setMessage(res?.message || "Đã gửi lại mã OTP thành công. Vui lòng kiểm tra email!");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi lại mã OTP. Vui lòng thử lại sau!";
      setError(errMsg);
    } finally {
      setIsResending(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex min-h-full items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
        {/* ===================== BƯỚC 1: FORM ĐĂNG KÝ ===================== */}
        {step === "form" ? (
          <>
            <h1 className="text-center text-3xl font-bold text-foreground">
              Đăng ký tài khoản
            </h1>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              Tạo tài khoản để bắt đầu mua sắm tại ABC
            </p>

            <form onSubmit={handleRegisterSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Họ và tên <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  autoComplete="name"
                  required
                  onChange={() => setError("")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  autoComplete="email"
                  required
                  onChange={() => setError("")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium">
                  Số điện thoại
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="Nhập số điện thoại"
                  autoComplete="tel"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                  }}
                  onChange={() => setError("")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="address" className="mb-2 block text-sm font-medium">
                  Địa chỉ nhận hàng
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                  autoComplete="street-address"
                  onChange={() => setError("")}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium">
                  Mật khẩu <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 6 ký tự"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    onChange={() => setError("")}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                  Xác nhận mật khẩu <span className="text-destructive">*</span>
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    autoComplete="new-password"
                    required
                    onChange={() => setError("")}
                    className={`${inputClass} pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-center text-sm text-destructive">
                  {error}
                </p>
              )}

              {message && (
                <p role="status" className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {loading ? "Đang gửi mã xác thực..." : "Đăng ký tài khoản"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground underline underline-offset-4"
              >
                Đăng nhập
              </Link>
            </p>
          </>
        ) : (
          /* ===================== BƯỚC 2: NHẬP MÃ OTP XÁC THỰC ===================== */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-foreground">
                Xác thực Email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Chúng tôi đã gửi mã xác thực 6 số đến hộp thư:
              </p>
              <p className="font-semibold text-foreground mt-0.5 break-all">
                {registeredEmail}
              </p>
            </div>

            {/* Gợi ý OTP ở chế độ dev khi chưa có SMTP */}
            {devOtp && (
              <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs text-center">
                <p className="font-semibold">Mã OTP thử nghiệm (devOtp):</p>
                <p className="font-mono text-base font-black tracking-widest mt-0.5 select-all">
                  {devOtp}
                </p>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="otp" className="mb-2 block text-center text-sm font-medium">
                  Nhập mã OTP (6 chữ số)
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    className="w-full text-center text-2xl font-mono font-bold tracking-[0.5em] rounded-lg border border-input bg-background px-4 py-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <KeyRound className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {error && (
                <p role="alert" className="text-center text-sm text-destructive">
                  {error}
                </p>
              )}

              {message && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Đang xác thực..." : "Xác nhận & Hoàn tất"}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setError("");
                    setMessage("");
                  }}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Sửa lại email
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || isResending}
                  className="flex items-center gap-1 font-semibold text-primary hover:underline disabled:opacity-50 disabled:no-underline"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
                  {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã OTP"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
