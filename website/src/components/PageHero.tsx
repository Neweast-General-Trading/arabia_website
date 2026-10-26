import Link from "next/link";
import type { Locale } from "@/lib/types";
import { pagePath } from "@/lib/api";
import { t, type UiKey } from "@/lib/i18n";

const links: { href: string; key: UiKey }[] = [
  { href: "/about", key: "overview" },
  { href: "/about/story", key: "story" },
  { href: "/about/mission", key: "mission" },
  { href: "/about/leadership", key: "leadership" },
];

export function AboutSubnav({ locale, current }: { locale: Locale; current: string }) {
  return (
    <nav className="sticky top-[76px] z-40 border-b border-black/5 bg-sand/90 backdrop-blur-xl">
      <div className="container-wide subnav-scroll flex justify-start gap-2 overflow-x-auto py-3">
        {links.map((item) => {
          const active = current === item.href;
          return (
            <Link
              key={item.href}
              href={pagePath(locale, item.href)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active ? "bg-navy text-white" : "bg-white text-navy/70 hover:text-navy"
              }`}
            >
              {t(locale, item.key)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-white pt-12 pb-12 md:pt-16 md:pb-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      <div className="page-hero container-wide text-start">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title mt-4 max-w-3xl">{title}</h1>
        {description && <p className="prose-body mt-5 max-w-2xl">{description}</p>}
      </div>
    </section>
  );
}
