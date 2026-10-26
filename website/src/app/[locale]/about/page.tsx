import type { Metadata } from "next";
import { AboutSubnav, PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { getSite, mediaUrl } from "@/lib/api";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  return buildMetadata(await getSite(locale as Locale), "about", locale as Locale, "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  const s = site.settings;

  return (
    <>
      <PageHero eyebrow={t(locale, "about")} title={s.overviewTitle} description={s.tagline} />
      <AboutSubnav locale={locale} current="/about" />
      <section className="bg-sand py-14 pb-24">
        <div className="container-wide grid items-center gap-12 lg:grid-cols-2">
          <Reveal from="left">
            <p className="prose-body whitespace-pre-line text-lg text-start">{s.overviewBody}</p>
          </Reveal>
          <Reveal delay={120} from="right">
            <div className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_50px_rgba(17,24,39,0.08)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(s.overviewImage)} alt={s.overviewTitle} className="min-h-[380px] w-full object-cover ken-slow" />
              <div className="media-shade" />
            </div>
          </Reveal>
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
