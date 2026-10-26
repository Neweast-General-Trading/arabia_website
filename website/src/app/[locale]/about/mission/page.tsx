import type { Metadata } from "next";
import { AboutSubnav, PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { SpotCard } from "@/components/SpotCard";
import { getSite } from "@/lib/api";
import { t } from "@/lib/i18n";
import { localizeDigits } from "@/lib/digits";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  return buildMetadata(await getSite(locale as Locale), "mission", locale as Locale, "/about/mission");
}

export default async function MissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  const s = site.settings;

  return (
    <>
      <PageHero eyebrow={t(locale, "about")} title={t(locale, "mission")} />
      <AboutSubnav locale={locale} current="/about/mission" />
      <section className="bg-sand py-14 pb-24">
        <div className="container-wide grid gap-5 md:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-[1.8rem] bg-white p-8 text-start shadow-[0_18px_40px_rgba(17,24,39,0.04)] md:p-10">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-brand">{localizeDigits("01", locale)}</p>
              <h2 className="mt-3 font-heading text-3xl text-navy">{s.missionTitle}</h2>
              <p className="prose-body mt-5">{s.missionBody}</p>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="relative h-full overflow-hidden rounded-[1.8rem] bg-navy p-8 text-start text-white md:p-10">
              <span className="absolute end-0 top-0 h-40 w-40 rounded-full bg-brand/20 blur-3xl" />
              <p className="relative text-[11px] font-semibold tracking-[0.22em] text-white/40">{localizeDigits("02", locale)}</p>
              <h2 className="relative mt-3 font-heading text-3xl">{s.visionTitle}</h2>
              <p className="relative mt-5 leading-8 text-white/80">{s.visionBody}</p>
            </article>
          </Reveal>
        </div>
        <div className="container-wide mt-16">
          <Reveal>
            <p className="eyebrow">{t(locale, "values")}</p>
            <h2 className="section-title mt-4">{t(locale, "values")}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {site.values.map((value, i) => (
              <Reveal key={value.id} delay={i * 70} from={i % 2 ? "scale" : "up"}>
                <SpotCard className="h-full rounded-[1.5rem]">
                <article className="card-hover h-full rounded-[1.5rem] bg-white p-6 text-start">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-brand">
                      <Icon name={value.icon} />
                    </span>
                    <span className="font-heading text-sm tracking-widest text-navy/20">{localizeDigits(String(i + 1).padStart(2, "0"), locale)}</span>
                  </div>
                  <h3 className="font-heading text-xl text-navy">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{value.body}</p>
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
