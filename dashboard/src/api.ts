export const API = import.meta.env.VITE_API_URL || "";
export const WEBSITE = import.meta.env.VITE_WEBSITE_URL || "/";

export function cmsPath(path: string) {
  const base = import.meta.env.BASE_URL || "/";
  return new URL(path.replace(/^\//, ""), `${window.location.origin}${base}`).pathname;
}

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${API}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getToken() {
  return localStorage.getItem("ne_token") || "";
}

export async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem("ne_token");
    if (!window.location.pathname.endsWith("/login")) {
      window.location.href = cmsPath("login");
    }
    throw new Error("Unauthorized");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || "Request failed");
  return data as T;
}

export const emptyBi = () => ({ en: "", ar: "" });
