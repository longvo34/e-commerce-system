import api from "../api";
import { LoginPayload } from "@/types";

export async function login(data: LoginPayload) {
  return await api.post("/auth/login", data);
}
