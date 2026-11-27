"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  UserItem,
  UserRole,
  UserStatus,
  CreateUserPayload,
  UpdateUserPayload,
} from "@/types";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  lockUser,
  unlockUser,
  changeUserRole,
} from "@/services/admin";
import {
  USER_ROLE_MAP,
  USER_STATUS_MAP,
  STATUS_THEME,
  NOTIFICATION_THEME,
} from "@/constants";
import {
  Users,
  UserPlus,
  Shield,
  Lock,
  Unlock,
  Edit3,
  Eye,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

export default function StaffManagementPanel() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // Notification state
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailUser, setDetailUser] = useState<UserItem | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states for Create
  const [createForm, setCreateForm] = useState<CreateUserPayload>({
    fullName: "",
    email: "",
    password: "",
    role: "PRODUCT_STAFF",
    phoneNumber: "",
    address: "",
  });

  // Form states for Edit
  const [editForm, setEditForm] = useState<UpdateUserPayload>({
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  // Form state for Change Role
  const [selectedNewRole, setSelectedNewRole] = useState<UserRole>("PRODUCT_STAFF");

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Fetch Users List
  const fetchUsersList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers({
        role: roleFilter === "ALL" ? undefined : (roleFilter as UserRole),
        status: statusFilter === "ALL" ? undefined : (statusFilter as UserStatus),
      });

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Không thể tải danh sách người dùng";
      showNotification("error", errMsg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsersList();
  }, [fetchUsersList]);

  // Handle Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.fullName.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      showNotification("error", "Vui lòng điền đầy đủ họ tên, email và mật khẩu.");
      return;
    }

    setSubmitting(true);
    try {
      const newUser = await createUser({
        ...createForm,
        fullName: createForm.fullName.trim(),
        email: createForm.email.trim(),
        phoneNumber: createForm.phoneNumber?.trim() || undefined,
        address: createForm.address?.trim() || undefined,
      });

      showNotification("success", `Tạo tài khoản ${newUser.fullName} thành công!`);
      setIsCreateModalOpen(false);
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        role: "PRODUCT_STAFF",
        phoneNumber: "",
        address: "",
      });
      fetchUsersList();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Tạo tài khoản thất bại.";
      showNotification("error", errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Detail Modal (GET /users/{id})
  const handleOpenDetail = async (user: UserItem) => {
    setSelectedUser(user);
    setDetailUser(user);
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const data = await getUserById(user.id);
      if (data) {
        setDetailUser(data);
      }
    } catch {
      // Giữ nguyên dữ liệu có sẵn từ bảng nếu request gặp lỗi
    } finally {
      setDetailLoading(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
    });
    setIsEditModalOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await updateUser(selectedUser.id, {
        fullName: editForm.fullName?.trim() || undefined,
        phoneNumber: editForm.phoneNumber?.trim() || undefined,
        address: editForm.address?.trim() || undefined,
      });

      showNotification("success", `Cập nhật thông tin #${selectedUser.id} thành công!`);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsersList();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Cập nhật thông tin thất bại.";
      showNotification("error", errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Open Change Role Modal
  const handleOpenRoleModal = (user: UserItem) => {
    setSelectedUser(user);
    setSelectedNewRole(user.role);
    setIsRoleModalOpen(true);
  };

  // Handle Change Role Submit
  const handleChangeRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      await changeUserRole(selectedUser.id, selectedNewRole);
      showNotification(
        "success",
        `Đã đổi vai trò cho ${selectedUser.fullName} thành ${USER_ROLE_MAP[selectedNewRole]?.label || selectedNewRole}`
      );
      setIsRoleModalOpen(false);
      setSelectedUser(null);
      fetchUsersList();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Đổi vai trò thất bại.";
      showNotification("error", errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Toggle Lock / Unlock
  const handleToggleLock = async (user: UserItem) => {
    const isLocked = user.status === "LOCKED";
    const confirmMsg = isLocked
      ? `Bạn có chắc muốn MỞ KHÓA tài khoản ${user.fullName} (${user.email})?`
      : `Bạn có chắc muốn KHÓA tài khoản ${user.fullName} (${user.email})? Người dùng sẽ không thể đăng nhập.`;

    if (!window.confirm(confirmMsg)) return;

    try {
      if (isLocked) {
        await unlockUser(user.id);
        showNotification("success", `Đã mở khóa tài khoản ${user.fullName}`);
      } else {
        await lockUser(user.id);
        showNotification("success", `Đã khóa tài khoản ${user.fullName}`);
      }
      fetchUsersList();
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error ? err.message : "Thao tác khóa/mở khóa thất bại.";
      showNotification("error", errMsg);
    }
  };

  // Filtered Users by Search Term
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.toLowerCase();
      const matchName = (u.fullName || "").toLowerCase().includes(q);
      const matchEmail = (u.email || "").toLowerCase().includes(q);
      const matchPhone = (u.phoneNumber || "").toLowerCase().includes(q);
      const matchAddress = (u.address || "").toLowerCase().includes(q);
      const matchId = String(u.id).includes(q);
      return matchName || matchEmail || matchPhone || matchAddress || matchId;
    });
  }, [users, searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const productStaffCount = users.filter((u) => u.role === "PRODUCT_STAFF").length;
    const inventoryStaffCount = users.filter((u) => u.role === "INVENTORY_STAFF").length;
    const customerCount = users.filter((u) => u.role === "CUSTOMER").length;
    const lockedCount = users.filter((u) => u.status === "LOCKED").length;

    return { total, adminCount, productStaffCount, inventoryStaffCount, customerCount, lockedCount };
  }, [users]);

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-sm transition-all border ${NOTIFICATION_THEME[notification.type] || STATUS_THEME.INFO.badgeClass
            }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Quản lý Người dùng & Phân quyền
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Role: ADMIN
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quản lý tài khoản quản trị viên, nhân viên kho, nhân viên sản phẩm và khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsersList}
            disabled={loading}
            className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-primary" : ""}`} />
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            + Thêm người dùng
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground">Tổng người dùng</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground">Quản trị viên (Admin)</span>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {stats.adminCount}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground">Nhân viên hệ thống</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {stats.productStaffCount + stats.inventoryStaffCount}
          </p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-card">
          <span className="text-xs text-muted-foreground">Tài khoản bị khóa</span>
          <p className="text-2xl font-bold text-destructive mt-1">{stats.lockedCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-card p-3 rounded-2xl border border-border">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "ALL", label: "Tất cả vai trò" },
            { id: "ADMIN", label: "Admin" },
            { id: "PRODUCT_STAFF", label: "NV Sản phẩm" },
            { id: "INVENTORY_STAFF", label: "NV Kho" },
            { id: "CUSTOMER", label: "Khách hàng" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${roleFilter === tab.id
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>

          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, SĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const roleMeta = USER_ROLE_MAP[u.role] || {
                    label: u.role,
                    badgeClass: "bg-muted text-muted-foreground",
                  };
                  const isLocked = u.status === "LOCKED";
                  const itemKey = `user-${u.id ?? idx}-${idx}`;

                  return (
                    <tr key={itemKey} className="hover:bg-muted/20 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                            {u.fullName ? u.fullName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground flex items-center gap-1.5">
                              {u.fullName || "—"}
                              <span className="text-[10px] text-muted-foreground font-normal">
                                #{u.id}
                              </span>
                            </p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {u.phoneNumber ? (
                          <p className="flex items-center gap-1 text-[11px] text-foreground">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            {u.phoneNumber}
                          </p>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">—</span>
                        )}
                        {u.address && (
                          <p className="flex items-center gap-1 text-[11px] truncate max-w-xs mt-0.5" title={u.address}>
                            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                            {u.address}
                          </p>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleMeta.badgeClass}`}
                        >
                          <Shield className="w-3 h-3" />
                          {roleMeta.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${isLocked
                            ? USER_STATUS_MAP.LOCKED.badgeClass
                            : USER_STATUS_MAP.ACTIVE.badgeClass
                            }`}
                        >
                          {isLocked ? "Đã khóa" : "Hoạt động"}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => handleOpenDetail(u)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Xem chi tiết (GET /users/{id})"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit info */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Change role */}
                          <button
                            onClick={() => handleOpenRoleModal(u)}
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-primary hover:text-primary transition-colors"
                            title="Đổi vai trò"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>

                          {/* Lock / Unlock */}
                          <button
                            onClick={() => handleToggleLock(u)}
                            className={`p-1.5 rounded-lg border transition-colors ${isLocked
                              ? "border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                              : "border-rose-500/20 text-rose-600 hover:bg-rose-500/10"
                              }`}
                            title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                          >
                            {isLocked ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TẠO TÀI KHOẢN (POST /users) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Thêm tài khoản nhân viên / Admin
              </h4>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Họ và tên <span className={STATUS_THEME.DANGER.textColor}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Trần Thị B"
                  value={createForm.fullName}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Email đăng nhập <span className={STATUS_THEME.DANGER.textColor}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="staff@example.com"
                    value={createForm.email}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Mật khẩu khởi tạo <span className={STATUS_THEME.DANGER.textColor}>*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={createForm.password}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Vai trò phân quyền <span className={STATUS_THEME.DANGER.textColor}>*</span>
                </label>
                <select
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      role: e.target.value as UserRole,
                    }))
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="PRODUCT_STAFF">Nhân viên Sản phẩm (PRODUCT_STAFF)</option>
                  <option value="INVENTORY_STAFF">Nhân viên Kho (INVENTORY_STAFF)</option>
                  {/* <option value="ADMIN">Quản trị viên (ADMIN)</option> */}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  * Tài khoản tạo tại đây được kích hoạt email sẵn và có thể đăng nhập ngay.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 0901234567"
                    value={createForm.phoneNumber || ""}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">Địa chỉ</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Quận 1, TP.HCM"
                    value={createForm.address || ""}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Đang tạo..." : "Tạo tài khoản"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHỈNH SỬA THÔNG TIN (PATCH /users/{id}) */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                Sửa thông tin: #{selectedUser.id}
              </h4>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-semibold text-foreground">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phoneNumber || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, phoneNumber: e.target.value }))
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">Địa chỉ</label>
                <input
                  type="text"
                  value={editForm.address || ""}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ĐỔI VAI TRÒ (PATCH /users/{id}/role) */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Đổi vai trò người dùng
              </h4>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangeRoleSubmit} className="space-y-4 mt-4">
              <div className="p-3 rounded-xl bg-muted/40 border border-border">
                <p className="text-xs font-semibold text-foreground">{selectedUser.fullName}</p>
                <p className="text-[11px] text-muted-foreground">{selectedUser.email}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Vai trò hiện tại:{" "}
                  <span className="font-semibold text-foreground">
                    {USER_ROLE_MAP[selectedUser.role]?.label || selectedUser.role}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">
                  Chọn vai trò mới <span className={STATUS_THEME.DANGER.textColor}>*</span>
                </label>
                <select
                  value={selectedNewRole}
                  onChange={(e) => setSelectedNewRole(e.target.value as UserRole)}
                  className="w-full mt-1.5 px-3 py-2 text-xs rounded-xl bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-hidden"
                >
                  <option value="PRODUCT_STAFF">Nhân viên Sản phẩm (PRODUCT_STAFF)</option>
                  <option value="INVENTORY_STAFF">Nhân viên Kho (INVENTORY_STAFF)</option>
                  {/* <option value="ADMIN">Quản trị viên (ADMIN)</option> */}
                  {/* <option value="CUSTOMER">Khách hàng thông thường (CUSTOMER)</option> */}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-xl border border-border hover:bg-muted text-muted-foreground"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? "Đang xử lý..." : "Cập nhật vai trò"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: XEM CHI TIẾT NGƯỜI DÙNG (GET /users/{id}) */}
      {isDetailModalOpen && detailUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                  {detailUser.fullName ? detailUser.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground flex items-center gap-2">
                    {detailUser.fullName || "Người dùng"}
                    <span className="text-xs text-muted-foreground font-normal">
                      #{detailUser.id}
                    </span>
                  </h4>
                  <p className="text-[11px] text-muted-foreground">{detailUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setDetailUser(null);
                }}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                Đang tải chi tiết người dùng...
              </div>
            ) : (
              <div className="space-y-4 mt-4 text-xs">
                {/* Badges status row */}
                <div className="flex items-center gap-2 flex-wrap pb-3 border-b border-border">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${USER_ROLE_MAP[detailUser.role]?.badgeClass || "bg-muted text-muted-foreground"
                      }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    {USER_ROLE_MAP[detailUser.role]?.label || detailUser.role}
                  </span>

                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${detailUser.status === "LOCKED"
                        ? USER_STATUS_MAP.LOCKED.badgeClass
                        : USER_STATUS_MAP.ACTIVE.badgeClass
                      }`}
                  >
                    {detailUser.status === "LOCKED" ? "Tài khoản bị khóa" : "Đang hoạt động"}
                  </span>

                  {detailUser.emailVerifiedAt ? (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${STATUS_THEME.SUCCESS.badgeClass}`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Email đã xác thực
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${STATUS_THEME.WARNING.badgeClass}`}
                    >
                      <AlertCircle className="w-3 h-3" />
                      Email chưa xác thực
                    </span>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-muted/20 p-4 rounded-xl border border-border/60">
                  <div>
                    <span className="text-[11px] text-muted-foreground block">Mã định danh (User ID)</span>
                    <span className="font-mono font-semibold text-foreground text-xs">
                      #{detailUser.id}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block">Họ và tên</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.fullName || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block">Email đăng nhập</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.email}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block">Số điện thoại</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.phoneNumber || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[11px] text-muted-foreground block">Địa chỉ liên hệ</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.address || "Chưa cập nhật"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block">Thời gian tạo</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.createdAt
                        ? new Date(detailUser.createdAt).toLocaleString("vi-VN")
                        : "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-muted-foreground block">Cập nhật lần cuối</span>
                    <span className="font-semibold text-foreground text-xs">
                      {detailUser.updatedAt
                        ? new Date(detailUser.updatedAt).toLocaleString("vi-VN")
                        : "—"}
                    </span>
                  </div>

                  {detailUser.emailVerifiedAt && (
                    <div className="sm:col-span-2">
                      <span className="text-[11px] text-muted-foreground block">Thời điểm xác thực email</span>
                      <span className="font-semibold text-foreground text-xs">
                        {new Date(detailUser.emailVerifiedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenEdit(detailUser);
                      }}
                      className="px-3 py-1.5 text-xs rounded-xl border border-border hover:bg-muted font-medium text-foreground flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-muted-foreground" />
                      Sửa thông tin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        handleOpenRoleModal(detailUser);
                      }}
                      className="px-3 py-1.5 text-xs rounded-xl border border-border hover:bg-muted font-medium text-primary flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Đổi vai trò
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setDetailUser(null);
                    }}
                    className="px-4 py-2 text-xs rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
