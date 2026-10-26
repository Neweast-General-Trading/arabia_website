import type { Metadata } from "next";
import { AboutSubnav, PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { TiltCard } from "@/components/TiltCard";
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
  return buildMetadata(await getSite(locale as Locale), "leadership", locale as Locale, "/about/leadership");
}

export default async function LeadershipPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);

  return (
    <>
      <PageHero eyebrow={t(locale, "about")} title={t(locale, "leadership")} description={t(locale, "leadershipIntro")} />
      <AboutSubnav locale={locale} current="/about/leadership" />
      <section className="bg-sand py-14 pb-24">
        <div className="container-wide grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {site.leaders.map((person, i) => (
            <Reveal key={person.id} delay={i * 80} from={i % 2 ? "scale" : "up"}>
              <TiltCard>
              <article className="card overflow-hidden rounded-[1.6rem]">
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-navy">
                  {person.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(person.image)} alt={person.name} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                  ) : (
                    <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 font-heading text-3xl text-white">
                      {person.name.slice(0, 1)}
                    </span>
                  )}
                  <span className="absolute start-0 top-8 h-10 w-1 bg-brand" />
                </div>
                <div className="p-6 text-start">
                  <h2 className="font-heading text-xl text-navy">{person.name}</h2>
                  <p className="mt-1 text-sm text-brand">{person.title}</p>
                  <p className="mt-3 text-sm leading-6 text-muted">{person.bio}</p>
                </div>
              </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
