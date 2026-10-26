"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const pathname = usePathname();
  const locale: Locale = pathname?.startsWith("/ar") ? "ar" : "en";

  return (
    <div className="container-wide py-24 text-start">
      <p className="eyebrow">{locale === "ar" ? "خطأ" : "Error"}</p>
      <h1 className="section-title mt-4">{t(locale, "unableToLoad")}</h1>
      <p className="prose-body mt-4 max-w-xl">{error.message}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          {t(locale, "tryAgain")}
        </button>
        <Link href={`/${locale}`} className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-navy">
          {t(locale, "backHome")}
        </Link>
      </div>
    </div>
  );
}
