export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

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
