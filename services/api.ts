const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Tự động lấy token nếu người dùng đã đăng nhập
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Có lỗi xảy ra khi gọi API");
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, { method: "GET", ...options }),

  post: <T = any>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  },

  put: <T = any>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return apiFetch<T>(endpoint, {
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  },

  patch: <T = any>(endpoint: string, data?: unknown, options?: RequestInit) => {
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;
    return apiFetch<T>(endpoint, {
      method: "PATCH",
      body: isFormData ? data : JSON.stringify(data),
      ...options,
    });
  },

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiFetch<T>(endpoint, {
      method: "DELETE",
      ...options,
    }),
};

export default api;
