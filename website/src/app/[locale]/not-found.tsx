import Link from "next/link";
import { headers } from "next/headers";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

export default async function NotFound() {
  const locale = ((await headers()).get("x-locale") || "en") === "ar" ? "ar" : "en";
  const loc = locale as Locale;

  return (
    <div className="container-wide py-24 text-start">
      <p className="eyebrow">404</p>
      <h1 className="section-title mt-4">{t(loc, "notFoundTitle")}</h1>
      <p className="prose-body mt-4 max-w-xl">{t(loc, "notFoundBody")}</p>
      <Link
        href={`/${loc}`}
        className="btn-lift mt-8 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand"
      >
        {t(loc, "backHome")}
      </Link>
    </div>
  );
}
