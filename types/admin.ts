export type UserRole = "ADMIN" | "PRODUCT_STAFF" | "INVENTORY_STAFF" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface UserItem {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  address?: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface ChangeRolePayload {
  role: UserRole;
}

export interface GetUsersParams {
  role?: UserRole;
  status?: UserStatus;
}
