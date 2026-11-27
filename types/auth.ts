export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  address?: string;
}

export interface RegisterResponse {
  message: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    emailVerifiedAt?: string | null;
  };
  devOtp?: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
  devOtp?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  devOtp?: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    role: string;
    emailVerifiedAt?: string | null;
  };
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
