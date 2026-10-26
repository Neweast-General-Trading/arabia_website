import type { Locale } from "./types";

const EASTERN = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN = "۰۱۲۳۴۵۶۷۸۹";

export function toWesternDigits(value: string) {
  return value
    .replace(/[٠-٩]/g, (digit) => String(EASTERN.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN.indexOf(digit)));
}

export function toEasternDigits(value: string) {
  return toWesternDigits(value).replace(/[0-9]/g, (digit) => EASTERN[Number(digit)]);
}

export function localizeDigits(value: string, locale: Locale) {
  return locale === "ar" ? toEasternDigits(value) : toWesternDigits(value);
}

const SKIP_KEYS = new Set([
  "email",
  "phone",
  "whatsapp",
  "websiteUrl",
  "ctaLink",
  "mapEmbedUrl",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
  "siteUrl",
  "logoLight",
  "logoDark",
  "favicon",
  "ogImage",
  "image",
  "logo",
  "src",
  "href",
  "url",
  "id",
  "analyticsId",
  "primaryColor",
  "secondaryColor",
  "accentColor",
  "mimeType",
]);

export function localizeTree(value: unknown, locale: Locale, key?: string): unknown {
  if (key && SKIP_KEYS.has(key)) return value;
  if (typeof value === "string") return localizeDigits(value, locale);
  if (Array.isArray(value)) return value.map((item) => localizeTree(item, locale));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([nextKey, nextValue]) => [
        nextKey,
        localizeTree(nextValue, locale, nextKey),
      ]),
    );
  }
  return value;
}
