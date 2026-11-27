import api from "../api";
import { LoginPayload, LoginResponse } from "@/types";

export async function login(data: LoginPayload): Promise<LoginResponse> {
  return await api.post<LoginResponse>("/auth/login", data);
}
