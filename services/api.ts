const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    // Tự động lấy token nếu người dùng đã đăng nhập
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(error.message || "Có lỗi xảy ra khi gọi API");
    }

    return res.json();
}

export const api = {
    get: (endpoint: string) => apiFetch(endpoint),

    post: (endpoint: string, data: unknown) =>
        apiFetch(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    put: (endpoint: string, data: unknown) =>
        apiFetch(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
        }),

    patch: (endpoint: string, data: unknown) =>
        apiFetch(endpoint, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),

    delete: (endpoint: string) =>
        apiFetch(endpoint, {
            method: "DELETE",
        }),
};

export default api;
