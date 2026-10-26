import type { MetadataRoute } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3020").replace(/\/$/, "");
const locales = ["en", "ar"];
const paths = [
  "",
  "/about",
  "/about/story",
  "/about/mission",
  "/about/leadership",
  "/governance",
  "/subsidiaries",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en${path}`,
          ar: `${siteUrl}/ar${path}`,
        },
      },
    })),
  );
}
