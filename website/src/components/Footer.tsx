import Link from "next/link";
import type { Locale, Settings, Subsidiary } from "@/lib/types";
import { mediaUrl, pagePath } from "@/lib/api";
import { t } from "@/lib/i18n";

export function Footer({
  locale,
  settings,
  subsidiaries,
}: {
  locale: Locale;
  settings: Settings;
  subsidiaries: Subsidiary[];
}) {
  return (
    <footer className="relative z-10 mt-auto bg-navy text-white">
      <div className="h-0.5 bg-brand" />
      <div className="container-wide grid gap-10 py-16 text-start md:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(settings.logoDark || settings.logoLight)}
            alt={settings.companyName}
            className="mb-5 h-8 w-auto max-w-[176px] object-contain"
          />
          <p className="text-sm leading-7 text-white/60">{settings.footerAbout}</p>
          {settings.linkedin && (
            <a
              href={settings.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold tracking-wide text-white/70 transition hover:border-white hover:text-white"
              aria-label="LinkedIn"
            >
              in
            </a>
          )}
        </div>
        <div>
          <h3 className="mb-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40">{t(locale, "quickLinks")}</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link className="transition hover:text-white" href={pagePath(locale, "/about")}>{t(locale, "overview")}</Link></li>
            <li><Link className="transition hover:text-white" href={pagePath(locale, "/about/story")}>{t(locale, "story")}</Link></li>
            <li><Link className="transition hover:text-white" href={pagePath(locale, "/about/leadership")}>{t(locale, "leadership")}</Link></li>
            <li><Link className="transition hover:text-white" href={pagePath(locale, "/governance")}>{t(locale, "governance")}</Link></li>
            <li><Link className="transition hover:text-white" href={pagePath(locale, "/contact")}>{t(locale, "contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40">{t(locale, "business")}</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            {subsidiaries.map((s) => (
              <li key={s.id}>
                <a className="transition hover:text-white" href={s.websiteUrl} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[11px] font-semibold tracking-[0.18em] uppercase text-white/40">{t(locale, "getInTouch")}</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>{settings.address}</li>
            <li><a className="transition hover:text-white" href={`mailto:${settings.email}`}>{settings.email}</a></li>
            <li><a className="transition hover:text-white" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs tracking-wide text-white/40">
        {settings.copyright}
      </div>
    </footer>
  );
}
