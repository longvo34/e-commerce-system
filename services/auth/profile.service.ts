import api from "../api";

export type UserProfile = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export type UpdateProfilePayload = Pick<
  UserProfile,
  "fullName" | "phoneNumber" | "address"
>;

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export function getMyProfile(): Promise<unknown> {
  return api.get("/auth/me");
}

export function updateMyProfile(data: UpdateProfilePayload): Promise<unknown> {
  return api.patch("/auth/me", data);
}

export function changePassword(data: ChangePasswordPayload): Promise<unknown> {
  return api.post("/auth/change-password", data);
}

export const mockProfile: UserProfile = {
  fullName: "Nguyễn Văn A",
  email: "demo@example.com",
  phoneNumber: "0901234567",
  address: "TP. Hồ Chí Minh",
};

export function parseUserProfile(response: unknown): UserProfile {
  if (!response || typeof response !== "object") {
    throw new Error("Response Profile không hợp lệ.");
  }

  let data: unknown = response;

  if ("data" in response) {
    data = response.data;
  }

  if (!data || typeof data !== "object") {
    throw new Error("Không tìm thấy dữ liệu Profile.");
  }

  if ("user" in data) {
    data = data.user;
  }

  if (!data || typeof data !== "object") {
    throw new Error("Không tìm thấy thông tin người dùng.");
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.fullName !== "string" || typeof obj.email !== "string") {
    throw new Error("Cấu trúc response GET /auth/me chưa khớp với frontend.");
  }

  return {
    fullName: obj.fullName,
    email: obj.email,
    phoneNumber: typeof obj.phoneNumber === "string" ? obj.phoneNumber : "",
    address: typeof obj.address === "string" ? obj.address : "",
  };
}
