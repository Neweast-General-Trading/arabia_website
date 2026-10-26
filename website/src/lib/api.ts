import type { Locale, SiteData } from "./types";
import { localizeTree } from "./digits";

export const INTERNAL_API =
  process.env.API_INTERNAL_URL || "http://127.0.0.1:4000";
export const PUBLIC_API = process.env.NEXT_PUBLIC_API_URL || "";

export const API_URL = PUBLIC_API;

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  return `${PUBLIC_API}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getSite(locale: Locale): Promise<SiteData> {
  const res = await fetch(`${INTERNAL_API}/api/public/site?locale=${locale}`, {
    next: { revalidate: 20 },
  });
  if (!res.ok) {
    throw new Error(`Unable to load site content (${res.status})`);
  }
  const data = (await res.json()) as SiteData;
  return localizeTree(data, locale) as SiteData;
}

export function pagePath(locale: Locale, href: string) {
  if (href.startsWith("http")) return href;
  const clean = href.startsWith("/") ? href : `/${href}`;
  return `/${locale}${clean === "/" ? "" : clean}`;
}
