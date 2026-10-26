import type { Metadata } from "next";
import { BrandBadge } from "@/components/BrandBadge";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { Moments } from "@/components/Moments";
import { getSite, mediaUrl } from "@/lib/api";
import { t } from "@/lib/i18n";
import { localizeDigits } from "@/lib/digits";
import { buildMetadata } from "@/lib/seo";
import type { Locale, Subsidiary } from "@/lib/types";
import { ArrowUpRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  return buildMetadata(await getSite(locale as Locale), "subsidiaries", locale as Locale, "/subsidiaries");
}

function SubsidiaryRow({
  sub,
  index,
  locale,
}: {
  sub: Subsidiary;
  index: number;
  locale: Locale;
}) {
  const reverse = index % 2 === 1;
  const n = localizeDigits(String(index + 1).padStart(2, "0"), locale);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(17,24,39,0.06)] transition-transform duration-500 hover:-translate-y-1.5 lg:flex-row ${
        reverse ? "lg:flex-row-reverse" : ""
      }`}
    >
      <div className="relative min-h-[300px] overflow-hidden lg:w-1/2 lg:min-h-[520px]">
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mediaUrl(sub.image)} alt={sub.name} className="h-full w-full object-cover ken-slow" />
        </div>
        <div className="media-shade" />
        <BrandBadge src={sub.logo} alt={sub.name} size="md" />
        <span className="absolute end-6 bottom-6 font-heading text-5xl text-white/30 transition-transform duration-500 group-hover:-translate-y-1 md:text-7xl">{n}</span>
        <div className="card-overlay text-start">
          <p className="text-sm text-white/80">{sub.tagline}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-white">
            {t(locale, "visitSite")}
            <ArrowUpRight size={13} className="dir-out" />
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center px-8 py-10 text-start lg:w-1/2 lg:px-14 lg:py-16">
        <p className="text-xs font-semibold tracking-[0.22em] text-brand">{n}</p>
        <h2 className="mt-4 text-xl font-bold uppercase tracking-wide text-navy md:text-2xl">{sub.name}</h2>
        <p className="mt-3 text-sm font-semibold tracking-[0.12em] uppercase text-muted">{sub.tagline}</p>
        <p className="prose-body mt-6 max-w-xl">{sub.description}</p>
        <a
          href={sub.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lift mt-9 inline-flex w-fit items-center gap-3 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand"
        >
          <span>{t(locale, "visitSite")}</span>
          <ArrowUpRight size={16} className="dir-out" />
        </a>
      </div>
    </article>
  );
}

export default async function SubsidiariesPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);

  return (
    <>
      <PageHero
        eyebrow={site.settings.companyName}
        title={t(locale, "businessesTitle")}
        description={t(locale, "businessesIntro")}
      />
      <section className="bg-sand py-12 pb-24">
        <div className="container-wide space-y-8">
          {site.subsidiaries.filter((b) => b.image).length >= 2 && (
            <Reveal from="scale">
              <Moments
                hint={t(locale, "visitSite")}
                items={site.subsidiaries
                  .filter((b) => b.image)
                  .map((b) => ({
                    src: b.image as string,
                    label: b.name,
                    href: b.websiteUrl,
                  }))}
              />
            </Reveal>
          )}
          {site.subsidiaries.map((sub, index) => (
            <Reveal key={sub.id} delay={index * 80} from={index % 2 ? "right" : "left"}>
              <SubsidiaryRow sub={sub} index={index} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
