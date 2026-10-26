import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { getSite } from "@/lib/api";
import { organizationJsonLd } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  const jsonLd = organizationJsonLd(site);

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className="flex min-h-full flex-1 flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header locale={locale} settings={site.settings} />
      <ScrollProgress />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer locale={locale} settings={site.settings} subsidiaries={site.subsidiaries} />
    </div>
  );
}
