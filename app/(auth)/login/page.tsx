"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage(
      "Giao diện đã nhận thông tin. Chức năng đăng nhập chưa kết nối backend.",
    );
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
              onChange={() => setMessage("")}
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
                onChange={() => setMessage("")}
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

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Đăng nhập
          </button>

          {message && (
            <p
              role="status"
              className="text-center text-sm text-muted-foreground"
            >
              {message}
            </p>
          )}
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
