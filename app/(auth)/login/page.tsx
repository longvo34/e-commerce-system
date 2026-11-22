"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/services/auth";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setError("");
      setMessage("");

      const formData = new FormData(e.currentTarget);
      const email = String(formData.get("email") ?? "").trim();
      const password = String(formData.get("password") ?? "");

      if (!email || !password) {
        setError("Vui lòng nhập đầy đủ email và mật khẩu.");
        return;
      }

      try {
        setLoading(true);
        const res = await login({ email, password });

        // 1. Lưu token vào Cookie để Middleware/Proxy trên Server đọc và bảo vệ trang
        document.cookie = `accessToken=${res.accessToken}; path=/; max-age=86400; SameSite=Lax`;

        // 2. Lưu token và thông tin user vào localStorage để phía Client tiện sử dụng
        localStorage.setItem("accessToken", res.accessToken);
        if (res.user) {
          localStorage.setItem("user", JSON.stringify(res.user));
        }

        setMessage("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1000);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Đăng nhập thất bại. Vui lòng kiểm tra lại!";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="flex min-h-full items-center justify-center bg-background px-4 py-16">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-10">
          <h1 className="text-center text-3xl font-bold text-foreground">
            Đăng nhập
          </h1>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            Chào mừng bạn quay trở lại ABC
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@email.com"
                autoComplete="email"
                required
                onChange={() => {
                  setError("");
                  setMessage("");
                }}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Mật khẩu
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  required
                  onChange={() => {
                    setError("");
                    setMessage("");
                  }}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
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

            {error && (
              <p role="alert" className="text-center text-sm text-destructive">
                {error}
              </p>
            )}

            {message && (
              <p
                role="status"
                className="text-center text-sm text-green-600 dark:text-green-400"
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="font-semibold text-foreground underline underline-offset-4"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    );
  }
