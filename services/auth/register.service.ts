import api from "../api";
import { RegisterPayload } from "@/types";

export async function register(data: RegisterPayload) {
  return await api.post("/auth/register", data);
}
