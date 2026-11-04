"use client";

import { useState, type FormEvent } from "react";
import { UserRound, Pencil, Mail, Phone, MapPin, Check, X } from "lucide-react";

type Profile = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

// Dữ liệu mẫu phục vụ phát triển UI
const initialProfile: Profile = {
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901234567",
  address: "TP. Hồ Chí Minh",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [form, setForm] = useState<Profile>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  function updateField(field: keyof Profile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setMessage("");
  }

  function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Chỉ cập nhật state giao diện, chưa gọi API
    setProfile({ ...form });
    setIsEditing(false);
    setMessage("Đã cập nhật thông tin trên giao diện (chưa lưu vào hệ thống).");
  }

  function handleCancel() {
    setForm({ ...profile });
    setIsEditing(false);
    setMessage("");
  }

  const fields: {
    label: string;
    name: keyof Profile;
    type: string;
    icon: typeof UserRound;
  }[] = [
    { label: "Họ và tên", name: "fullName", type: "text", icon: UserRound },
    { label: "Email", name: "email", type: "email", icon: Mail },
    { label: "Số điện thoại", name: "phone", type: "tel", icon: Phone },
    { label: "Địa chỉ", name: "address", type: "text", icon: MapPin },
  ];

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quản lý thông tin tài khoản của bạn
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile summary */}
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

            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-medium">Tài khoản của tôi</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Xem và cập nhật thông tin cá nhân
              </p>
            </div>
          </aside>

          {/* Profile form */}
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:col-span-2 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Chi tiết hồ sơ tài khoản
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setMessage("");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Pencil size={16} />
                  Chỉnh sửa
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {fields.map(({ label, name, type, icon: Icon }) => (
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
                      name={name}
                      type={type}
                      value={form[name]}
                      onChange={(e) => updateField(name, e.target.value)}
                      disabled={!isEditing}
                      required={name !== "address"}
                      autoComplete={
                        name === "fullName"
                          ? "name"
                          : name === "email"
                            ? "email"
                            : name === "phone"
                              ? "tel"
                              : "street-address"
                      }
                      className="w-full rounded-lg border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:bg-muted/50"
                    />
                  </div>
                </div>
              ))}

              {message && (
                <p role="status" className="text-sm text-muted-foreground">
                  {message}
                </p>
              )}

              {isEditing && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Check size={18} />
                    Lưu thay đổi
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
                  >
                    <X size={18} />
                    Hủy
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
