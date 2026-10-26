import type { Metadata } from "next";
import { AboutSubnav, PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CtaBand } from "@/components/CtaBand";
import { YearRail } from "@/components/YearRail";
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
  return buildMetadata(await getSite(locale as Locale), "story", locale as Locale, "/about/story");
}

export default async function StoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);

  return (
    <>
      <PageHero eyebrow={t(locale, "about")} title={t(locale, "story")} description={t(locale, "storyIntro")} />
      <AboutSubnav locale={locale} current="/about/story" />
      <section className="bg-sand py-12 pb-24">
        <div className="container-wide space-y-8">
          <YearRail items={site.story.map((item) => ({ id: item.id, year: item.year }))} />
          {site.story.map((item, index) => {
            const reverse = index % 2 === 1;
            return (
              <Reveal key={item.id} delay={index * 70} from={reverse ? "right" : "left"}>
                <article
                  id={`story-${item.id}`}
                  className={`group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_rgba(17,24,39,0.06)] transition-transform duration-500 hover:-translate-y-1.5 md:flex-row ${
                    reverse ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="relative h-[260px] overflow-hidden md:h-auto md:min-h-[380px] md:w-1/2">
                    {item.image ? (
                      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl(item.image)}
                          alt={item.title}
                          className="h-full w-full object-cover ken-slow"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-navy" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    <p className="absolute start-6 bottom-6 font-heading text-4xl text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-6xl">{item.year}</p>
                  </div>
                  <div className="flex flex-col justify-center px-8 py-10 text-start md:w-1/2 md:px-14 md:py-16">
                    <p className="eyebrow">{item.year}</p>
                    <h2 className="section-title mt-4">{item.title}</h2>
                    <p className="prose-body mt-5 max-w-lg">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
      <CtaBand locale={locale} />
    </>
  );
}
