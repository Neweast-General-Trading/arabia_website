"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Locale, Settings } from "@/lib/types";
import { mediaUrl, pagePath } from "@/lib/api";
import { otherLocale, switchLocalePath, t } from "@/lib/i18n";

export function Header({ locale, settings }: { locale: Locale; settings: Settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nextLocale = otherLocale(locale);
  const logo = settings.logoLight || settings.logoDark;

  const aboutLinks = [
    { href: "/about", label: t(locale, "overview") },
    { href: "/about/story", label: t(locale, "story") },
    { href: "/about/mission", label: t(locale, "mission") },
    { href: "/about/leadership", label: t(locale, "leadership") },
  ];

  const isActive = (href: string) => {
    const full = pagePath(locale, href);
    if (href === "/") return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname === full || pathname.startsWith(`${full}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-black/8 shadow-[0_10px_30px_rgba(17,24,39,0.06)]" : "border-black/5"
      }`}
    >
      <div className="container-wide flex h-[76px] items-center justify-between gap-4">
        <Link href={pagePath(locale, "/")} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mediaUrl(logo)}
            alt={settings.companyName}
            className="h-8 w-auto max-w-[168px] object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-sand px-1.5 py-1.5 lg:flex">
          <Link className={navClass(isActive("/"))} href={pagePath(locale, "/")}>
            {t(locale, "home")}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <Link className={`${navClass(isActive("/about"))} inline-flex items-center gap-1`} href={pagePath(locale, "/about")}>
              {t(locale, "about")}
              <ChevronDown size={13} />
            </Link>
            {aboutOpen && (
              <div className="absolute top-full start-0 min-w-[250px] pt-3">
                <div className="card overflow-hidden rounded-2xl py-2 shadow-xl">
                  {aboutLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={pagePath(locale, item.href)}
                      className="block px-4 py-2.5 text-sm text-navy/70 transition-colors hover:bg-sand hover:text-navy"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Link className={navClass(isActive("/governance"))} href={pagePath(locale, "/governance")}>
            {t(locale, "governance")}
          </Link>
          <Link className={navClass(isActive("/subsidiaries"))} href={pagePath(locale, "/subsidiaries")}>
            {t(locale, "business")}
          </Link>
          <Link className={navClass(isActive("/contact"))} href={pagePath(locale, "/contact")}>
            {t(locale, "contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={switchLocalePath(pathname, nextLocale)}
            hrefLang={nextLocale}
            className="rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-semibold tracking-wide text-navy transition hover:border-navy/20"
          >
            {t(locale, "language")}
          </Link>
          <Link
            href={pagePath(locale, "/contact")}
            className="hidden rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand sm:inline-flex"
          >
            {t(locale, "getInTouch")}
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/8 bg-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t(locale, "closeMenu") : t(locale, "openMenu")}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-[76px] z-40 overflow-y-auto bg-white lg:hidden">
          <div className="container-wide flex flex-col gap-1 py-8 text-start">
            <Link className="rounded-2xl px-2 py-3 text-2xl font-heading text-navy" onClick={() => setOpen(false)} href={pagePath(locale, "/")}>
              {t(locale, "home")}
            </Link>
            {aboutLinks.map((item) => (
              <Link
                key={item.href}
                className="rounded-2xl px-2 py-3 text-lg text-navy/80"
                onClick={() => setOpen(false)}
                href={pagePath(locale, item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="rounded-2xl px-2 py-3 text-2xl font-heading text-navy" onClick={() => setOpen(false)} href={pagePath(locale, "/governance")}>
              {t(locale, "governance")}
            </Link>
            <Link className="rounded-2xl px-2 py-3 text-2xl font-heading text-navy" onClick={() => setOpen(false)} href={pagePath(locale, "/subsidiaries")}>
              {t(locale, "business")}
            </Link>
            <Link
              className="mt-6 inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
              href={pagePath(locale, "/contact")}
            >
              {t(locale, "contact")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function navClass(active: boolean) {
  return `relative cursor-pointer px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 ${
    active ? "bg-navy text-white" : "text-navy/70 hover:text-navy hover:bg-white"
  }`;
}
