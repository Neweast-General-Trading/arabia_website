import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { BrandBadge } from "@/components/BrandBadge";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { Stats } from "@/components/Stats";
import { CtaBand } from "@/components/CtaBand";
import { TiltCard } from "@/components/TiltCard";
import { Moments } from "@/components/Moments";
import { BrandMarquee } from "@/components/BrandMarquee";
import { SpotCard } from "@/components/SpotCard";
import { getSite, mediaUrl, pagePath } from "@/lib/api";
import { t } from "@/lib/i18n";
import { localizeDigits } from "@/lib/digits";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  return buildMetadata(site, "home", locale, "");
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = raw === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  const s = site.settings;
  const leader = site.leaders[0];
  const businesses = site.subsidiaries.slice(0, 3);

  return (
    <>
      <Hero banners={site.banners} locale={locale} companyName={s.companyName} />
      <BrandMarquee items={businesses.map((b) => ({ name: b.name, logo: b.logo }))} />

      <section className="bg-sand py-20 md:py-24">
        <div className="container-wide">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl text-start">
                <p className="eyebrow">{t(locale, "businesses")}</p>
                <h2 className="section-title mt-4">{t(locale, "businessesTitle")}</h2>
              </div>
              <Link
                href={pagePath(locale, "/subsidiaries")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy transition hover:text-brand"
              >
                {t(locale, "viewBusinesses")}
                <ArrowUpRight size={16} className="dir-out" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {businesses.map((sub, i) => (
              <Reveal key={sub.id} delay={i * 110} from={i === 1 ? "scale" : "up"}>
                <TiltCard>
                  <a
                    href={sub.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card group flex h-full flex-col overflow-hidden rounded-[1.6rem]"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl(sub.image)}
                        alt={sub.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="media-shade" />
                      <BrandBadge src={sub.logo} alt={sub.name} />
                      <div className="card-overlay text-start">
                        <p className="line-clamp-3 text-sm leading-6 text-white/85">{sub.description}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white">
                          {t(locale, "visitSite")}
                          <ArrowUpRight size={13} className="dir-out" />
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 text-start">
                      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-muted">{sub.tagline}</p>
                      <h3 className="mt-2 flex items-center justify-between gap-2 text-sm font-bold uppercase tracking-wide text-navy">
                        <span className="whitespace-nowrap">{sub.name}</span>
                        <ArrowUpRight size={15} className="dir-out shrink-0 text-brand transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </h3>
                    </div>
                  </a>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container-wide">
          <Reveal>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 text-start">
              <div>
                <p className="eyebrow">{t(locale, "moments")}</p>
                <h2 className="section-title mt-4">{t(locale, "momentsTitle")}</h2>
              </div>
              <p className="text-sm text-muted">{t(locale, "hoverExplore")}</p>
            </div>
          </Reveal>
          <Reveal from="scale" delay={80}>
            <Moments
              hint={t(locale, "visitSite")}
              items={businesses
                .filter((b) => b.image)
                .map((b) => ({
                  src: b.image as string,
                  label: b.name,
                  href: b.websiteUrl,
                }))}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-24">
        <div className="container-wide grid items-center gap-14 lg:grid-cols-2">
          <Reveal from="left">
            <div className="text-start">
              <p className="eyebrow">{t(locale, "aboutLegacy")}</p>
              <h2 className="section-title mt-4">{s.whoWeAreTitle}</h2>
              <p className="prose-body mt-6">{s.whoWeAreBody}</p>
              <Link
                href={pagePath(locale, "/about")}
                className="btn-lift mt-8 inline-flex rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-brand"
              >
                {t(locale, "learnMore")}
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120} from="right">
            <div className="relative md:pb-4 md:pe-4">
              <div className="absolute -bottom-4 -end-4 hidden h-full w-full rounded-[2rem] bg-brand/10 md:block" />
              <div className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_50px_rgba(17,24,39,0.1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(s.whoWeAreImage)}
                  alt={s.whoWeAreTitle}
                  className="h-[420px] w-full object-cover ken-slow"
                />
                <div className="media-shade" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Stats stats={Array.isArray(s.stats) ? s.stats : []} locale={locale} />

      {leader && (
        <section className="bg-white py-20 md:py-24">
          <div className="container-wide grid gap-10 md:grid-cols-[240px_1fr] md:items-center">
            <Reveal from="left">
              <div className="text-start">
                <p className="eyebrow">{t(locale, "quoteLabel")}</p>
                <h3 className="mt-4 font-heading text-2xl text-navy">{leader.name}</h3>
                <p className="mt-1 text-sm text-muted">{leader.title}</p>
              </div>
            </Reveal>
            <Reveal delay={100} from="right">
              <blockquote className="relative border-s-2 border-brand ps-6 text-start md:ps-10">
                <span className="absolute -top-6 start-4 font-heading text-7xl leading-none text-brand/20">“</span>
                <p className="relative text-2xl leading-relaxed text-navy md:text-3xl">
                  {leader.bio.split(".").slice(0, 1).join(".")}.
                </p>
              </blockquote>
            </Reveal>
          </div>
        </section>
      )}

      <section className="bg-sand py-20 md:py-24">
        <div className="container-wide text-start">
          <Reveal>
            <p className="eyebrow">{t(locale, "pillars")}</p>
            <h2 className="section-title mt-4 max-w-3xl">{t(locale, "pillarsTitle")}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {site.pillars.map((pillar, i) => (
              <Reveal key={pillar.id} delay={i * 80} from={i % 2 ? "right" : "left"}>
                <SpotCard className="h-full rounded-[1.6rem]">
                <article className="card-hover pillar-card h-full rounded-[1.6rem] bg-white p-8 text-start">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-brand">
                      <Icon name={pillar.icon} />
                    </span>
                    <span className="font-heading text-sm tracking-widest text-navy/20">{localizeDigits(String(i + 1).padStart(2, "0"), locale)}</span>
                  </div>
                  <h3 className="font-heading text-xl text-navy">{pillar.title}</h3>
                  <p className="prose-body mt-3">{pillar.body}</p>
                </article>
                </SpotCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBand locale={locale} />
    </>
  );
}
