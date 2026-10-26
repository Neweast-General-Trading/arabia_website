import type { Metadata } from "next";
import type { Locale, SiteData } from "./types";
import { mediaUrl } from "./api";

export function buildMetadata(
  site: SiteData,
  slug: string,
  locale: Locale,
  path: string,
): Metadata {
  const page = site.pages[slug];
  const settings = site.settings;
  const title = page?.title || settings.seoTitle || settings.companyName;
  const description = page?.description || settings.seoDescription || settings.tagline;
  const keywords = page?.keywords || settings.seoKeywords;
  const og = mediaUrl(page?.ogImage || settings.ogImage);
  const siteUrl = (settings.siteUrl || "http://localhost:3020").replace(/\/$/, "");
  const canonical = `${siteUrl}/${locale}${path}`;
  const altEn = `${siteUrl}/en${path}`;
  const altAr = `${siteUrl}/ar${path}`;

  return {
    title,
    description,
    keywords: keywords ? keywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical,
      languages: { en: altEn, ar: altAr, "x-default": altEn },
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      url: canonical,
      siteName: settings.companyName,
      title,
      description,
      images: og ? [{ url: og, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: og ? [og] : undefined,
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd(site: SiteData) {
  const s = site.settings;
  const siteUrl = (s.siteUrl || "http://localhost:3020").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.companyName,
    url: siteUrl,
    logo: mediaUrl(s.logoLight),
    description: s.seoDescription || s.tagline,
    email: s.email,
    telephone: s.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.address,
      addressCountry: "SA",
    },
    sameAs: [s.linkedin, s.twitter, s.instagram, s.youtube].filter(Boolean),
    subOrganization: site.subsidiaries.map((sub) => ({
      "@type": "Organization",
      name: sub.name,
      url: sub.websiteUrl,
      description: sub.description,
    })),
  };
}
