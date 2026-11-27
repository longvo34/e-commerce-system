import api from "../api";
import {
  UserItem,
  CreateUserPayload,
  UpdateUserPayload,
  GetUsersParams,
} from "@/types";

/**
 * 1. GET /users - Danh sách người dùng
 * Quyền: ADMIN
 * Query params: role (ADMIN, PRODUCT_STAFF, INVENTORY_STAFF, CUSTOMER), status (ACTIVE, LOCKED)
 */
export async function getUsers(params?: GetUsersParams): Promise<UserItem[]> {
  const searchParams = new URLSearchParams();
  if (params?.role) searchParams.append("role", params.role);
  if (params?.status) searchParams.append("status", params.status);

  const query = searchParams.toString();
  const endpoint = query ? `/users?${query}` : "/users";
  return await api.get<UserItem[]>(endpoint);
}

/**
 * 2. GET /users/{id} - Chi tiết một người dùng
 * Quyền: ADMIN
 */
export async function getUserById(id: number | string): Promise<UserItem> {
  return await api.get<UserItem>(`/users/${id}`);
}

/**
 * 3. POST /users - Tạo tài khoản nhân viên hoặc admin (PRODUCT_STAFF / INVENTORY_STAFF / ADMIN)
 * Quyền: ADMIN
 */
export async function createUser(data: CreateUserPayload): Promise<UserItem> {
  return await api.post<UserItem>("/users", data);
}

/**
 * 4. PATCH /users/{id} - Chỉnh sửa thông tin người dùng (fullName, phoneNumber, address)
 * Quyền: ADMIN
 */
export async function updateUser(
  id: number | string,
  data: UpdateUserPayload
): Promise<UserItem> {
  return await api.patch<UserItem>(`/users/${id}`, data);
}

/**
 * 5. PATCH /users/{id}/lock - Khóa tài khoản 
 * Quyền: ADMIN
 */
export async function lockUser(id: number | string): Promise<unknown> {
  return await api.patch(`/users/${id}/lock`);
}

/**
 * 6. PATCH /users/{id}/unlock - Mở khóa tài khoản
 * Quyền: ADMIN
 */
export async function unlockUser(id: number | string): Promise<unknown> {
  return await api.patch(`/users/${id}/unlock`);
}

/**
 * 7. PATCH /users/{id}/role - Đổi role của nhân viên
 * Quyền: ADMIN
 * @param role ADMIN | PRODUCT_STAFF | INVENTORY_STAFF | CUSTOMER
 */
export async function changeUserRole(
  id: number | string,
  role: string
): Promise<UserItem> {
  return await api.patch<UserItem>(`/users/${id}/role`, { role });
}
