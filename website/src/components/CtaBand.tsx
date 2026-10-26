import Link from "next/link";
import type { Locale } from "@/lib/types";
import { pagePath } from "@/lib/api";
import { t } from "@/lib/i18n";

export function CtaBand({
  locale,
  title,
  body,
}: {
  locale: Locale;
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div className="h-0.5 bg-brand" />
      <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl orb-float" />
      <div className="container-wide relative py-16 text-start md:py-20">
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40">
          {t(locale, "getInTouch")}
        </p>
        <h2 className="section-title mt-4 max-w-3xl text-white">{title || t(locale, "partnerTitle")}</h2>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/65">{body || t(locale, "partnerBody")}</p>
        <Link
          href={pagePath(locale, "/contact")}
          className="btn-lift mt-8 inline-flex rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {t(locale, "contact")}
        </Link>
      </div>
    </section>
  );
}
