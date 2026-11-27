"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, Mail, ArrowLeft, RefreshCw, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { forgotPassword, resetPassword } from "@/services/auth";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<"request" | "reset">("request");

  // State
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Timer cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "reset" && resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCooldown]);

  // Bước 1: Gửi yêu cầu OTP quên mật khẩu
  async function handleRequestSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Vui lòng nhập địa chỉ email của bạn.");
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email: cleanEmail });

      setDevOtp(res?.devOtp || null);
      setResendCooldown(60);
      setStep("reset");
      // setMessage(
      //   res?.message ||
      //     `Nếu email ${cleanEmail} có tài khoản, mã đặt lại mật khẩu đã được gửi tới hộp thư đó.`
      // );
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi mã đặt lại mật khẩu. Vui lòng thử lại!";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Bước 2: Nhập OTP và Đặt lại mật khẩu mới
  async function handleResetSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 chữ số mã OTP.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({
        email: email.trim(),
        otp: cleanOtp,
        newPassword,
      });

      setMessage(
        res?.message ||
        "Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập..."
      );
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Mã OTP sai hoặc đã hết hạn. Vui lòng thử lại!";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }

  // Gửi lại mã OTP
  async function handleResendOtp() {
    if (resendCooldown > 0 || isResending) return;
    setError("");
    setMessage("");
    setIsResending(true);

    try {
      const res = await forgotPassword({ email: email.trim() });
      setDevOtp(res?.devOtp || null);
      setResendCooldown(60);
      setMessage(
        res?.message || "Đã gửi lại mã OTP đặt lại mật khẩu. Vui lòng kiểm tra email!"
      );
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
    <div className="flex min-h-full items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
        {/* ===================== BƯỚC 1: NHẬP EMAIL ===================== */}
        {step === "request" ? (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <KeyRound className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-foreground">
                Quên mật khẩu?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Đừng lo lắng! Nhập địa chỉ email tài khoản của bạn để nhận mã OTP đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={handleRequestSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email tài khoản
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="example@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className={`${inputClass} pl-10`}
                  />
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
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
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Đang gửi yêu cầu..." : "Gửi mã OTP xác nhận"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Nhớ lại mật khẩu?{" "}
              <Link
                href="/login"
                className="font-semibold text-foreground underline underline-offset-4"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </>
        ) : (
          /* ===================== BƯỚC 2: NHẬP OTP & ĐẶT LẠI MẬT KHẨU ===================== */
          <>
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-foreground">
                Đặt lại mật khẩu
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Mã OTP 6 số đã được gửi đến hộp thư:
              </p>
              <p className="font-semibold text-foreground mt-0.5 break-all">
                {email}
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

            <form onSubmit={handleResetSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="otp" className="mb-2 block text-sm font-medium">
                  Mã OTP (6 chữ số) <span className="text-destructive">*</span>
                </label>
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
                  className="w-full text-center text-xl font-mono font-bold tracking-[0.4em] rounded-lg border border-input bg-background px-4 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="mb-2 block text-sm font-medium">
                  Mật khẩu mới <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 6 ký tự"
                    minLength={6}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
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
                  Xác nhận mật khẩu mới <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError("");
                    }}
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
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || !newPassword}
                className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep("request");
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
