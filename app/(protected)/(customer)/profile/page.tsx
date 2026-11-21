"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  UserRound,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Check,
  X,
  LockKeyhole,
} from "lucide-react";
import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  parseUserProfile,
  mockProfile,
  type UserProfile,
} from "@/services/auth";

const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_PROFILE === "true";

const emptyProfile: UserProfile = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: "",
};

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState<UserProfile>(emptyProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  // GET /auth/me
  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError("");

      try {
        let user: UserProfile;

        if (IS_MOCK) {
          user = mockProfile;
        } else {
          if (!process.env.NEXT_PUBLIC_API_URL) {
            throw new Error("Chưa cấu hình URL backend.");
          }

          const response = await getMyProfile();
          user = parseUserProfile(response);
        }

        if (!cancelled) {
          setProfile(user);
          setForm(user);
        }
      } catch (err) {
        if (!cancelled) {
          setError(errorMessage(err));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  function updateField(
    field: "fullName" | "phoneNumber" | "address",
    value: string,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
    setError("");
  }

  // PATCH /auth/me
  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!profile || saving) return;

    const data = {
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      address: form.address.trim(),
    };

    if (!data.fullName || !data.phoneNumber) {
      setError("Vui lòng nhập họ tên và số điện thoại.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      let updatedProfile: UserProfile;

      if (IS_MOCK) {
        updatedProfile = { ...profile, ...data };
      } else {
        await updateMyProfile(data);

        // Lấy lại dữ liệu thật sau khi PATCH thành công.
        const response = await getMyProfile();
        updatedProfile = parseUserProfile(response);
      }

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setIsEditing(false);

      setMessage(
        IS_MOCK
          ? "Đã cập nhật bản xem trước. Chưa lưu lên server."
          : "Cập nhật thông tin thành công.",
      );
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (!profile) return;
    setForm(profile);
    setIsEditing(false);
    setError("");
    setMessage("");
  }

  // POST /auth/change-password
  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (changingPassword) return;

    setPasswordError("");
    setPasswordMessage("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (newPassword === oldPassword) {
      setPasswordError("Mật khẩu mới phải khác mật khẩu cũ.");
      return;
    }

    setChangingPassword(true);

    try {
      if (IS_MOCK) {
        setPasswordMessage("Form hợp lệ. Chế độ demo chưa đổi mật khẩu thật.");
      } else {
        await changePassword({
          oldPassword,
          newPassword,
        });

        setPasswordMessage("Yêu cầu đổi mật khẩu thành công.");
      }

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(errorMessage(err));
    } finally {
      setChangingPassword(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 " +
    "text-sm text-foreground outline-none " +
    "focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:bg-muted/50 disabled:cursor-default";

  const fields = [
    {
      label: "Họ và tên",
      name: "fullName",
      type: "text",
      icon: UserRound,
      autoComplete: "name",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      icon: Mail,
      autoComplete: "email",
    },
    {
      label: "Số điện thoại",
      name: "phoneNumber",
      type: "tel",
      icon: Phone,
      autoComplete: "tel",
    },
    {
      label: "Địa chỉ",
      name: "address",
      type: "text",
      icon: MapPin,
      autoComplete: "street-address",
    },
  ] as const;

  if (loading) {
    return (
      <main className="p-10 text-center text-muted-foreground">
        Đang tải thông tin cá nhân...
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="mx-auto max-w-xl p-10 text-center">
        <p role="alert" className="text-destructive">
          {error || "Không thể tải thông tin cá nhân."}
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => setReloadKey((key) => key + 1)}
        >
          Thử lại
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Quản lý thông tin tài khoản và bảo mật
        </p>

        {IS_MOCK && (
          <div className="mt-5 rounded-lg border border-border bg-muted p-3 text-sm">
            Chế độ demo: dữ liệu chỉ dùng để kiểm tra giao diện, không lưu vào
            backend.
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Thông tin tổng quan */}
          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                <UserRound className="h-11 w-11 text-secondary-foreground" />
              </div>

              <h2 className="mt-4 text-xl font-semibold">{profile.fullName}</h2>

              <p className="mt-1 break-all text-sm text-muted-foreground">
                {profile.email}
              </p>

              <span className="mt-4 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
                Khách hàng
              </span>
            </div>
          </aside>

          {/* Form Profile */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setMessage("");
                    setError("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
                >
                  <Pencil size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {fields.map(({ label, name, type, icon: Icon, autoComplete }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="mb-2 block text-sm font-medium"
                  >
                    {label}
                  </label>

                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                    <input
                      id={name}
                      type={type}
                      value={form[name]}
                      autoComplete={autoComplete}
                      disabled={!isEditing || name === "email" || saving}
                      required={name === "fullName" || name === "phoneNumber"}
                      onChange={(e) => {
                        if (name !== "email") {
                          updateField(name, e.target.value);
                        }
                      }}
                      className={`${inputClass} pl-11`}
                    />
                  </div>
                </div>
              ))}

              {message && (
                <p role="status" className="text-sm text-foreground">
                  {message}
                </p>
              )}

              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}

              {isEditing && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    <Check size={18} />
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>

        {/* Form đổi mật khẩu */}
        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <LockKeyhole className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
          </div>

          <form onSubmit={handleChangePassword} className="max-w-xl space-y-5">
            <div>
              <label
                htmlFor="oldPassword"
                className="mb-2 block text-sm font-medium"
              >
                Mật khẩu hiện tại
              </label>
              <input
                id="oldPassword"
                type="password"
                autoComplete="current-password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium"
              >
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            {passwordError && (
              <p role="alert" className="text-sm text-destructive">
                {passwordError}
              </p>
            )}

            {passwordMessage && (
              <p role="status" className="text-sm text-foreground">
                {passwordMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={changingPassword}
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {changingPassword ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
