import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getSite, pagePath } from "@/lib/api";
import { t } from "@/lib/i18n";
import { localizeDigits } from "@/lib/digits";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { Eye, Landmark, Scale, Shield, Sprout } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  return buildMetadata(await getSite(locale as Locale), "governance", locale as Locale, "/governance");
}

const icons = [Landmark, Shield, Eye, Sprout];

export default async function GovernancePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);

  return (
    <>
      <PageHero
        eyebrow={site.settings.companyName}
        title={t(locale, "governance")}
        description={t(locale, "governanceIntro")}
      />

      <section className="bg-sand pb-24 pt-4">
        <div className="container-wide">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.2fr] lg:items-start lg:gap-16">
            <Reveal>
              <aside className="text-start lg:sticky lg:top-28">
                <p className="eyebrow">{t(locale, "governanceEyebrow")}</p>
                <h2 className="section-title mt-4 max-w-sm">{t(locale, "governance")}</h2>
                <p className="prose-body mt-5 max-w-md">{t(locale, "governanceIntro")}</p>
                <div className="mt-8 hidden h-px w-16 bg-brand lg:block" />
              </aside>
            </Reveal>

            <div className="relative">
              <div className="absolute inset-y-3 start-[15px] w-px bg-line" />
              <div className="space-y-5">
                {site.governance.map((item, i) => {
                  const Icon = icons[i] || Scale;
                  const n = localizeDigits(String(i + 1).padStart(2, "0"), locale);
                  return (
                    <Reveal key={item.id} delay={i * 90}>
                      <article className="relative rounded-[1.7rem] bg-white p-7 ps-16 text-start shadow-[0_18px_40px_rgba(17,24,39,0.04)] transition-transform duration-500 hover:-translate-y-1 md:p-9 md:ps-20">
                        <span className="absolute start-5 top-7 flex h-8 w-8 items-center justify-center rounded-full bg-sand text-brand md:start-6 md:top-9">
                          <Icon size={16} />
                        </span>
                        <p className="text-[11px] font-semibold tracking-[0.22em] text-brand">{n}</p>
                        <h3 className="mt-2 font-heading text-xl text-navy md:text-2xl">{item.title}</h3>
                        <p className="prose-body mt-3 text-[1rem]">{item.body}</p>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>

          <Reveal delay={120}>
            <div className="mt-16 overflow-hidden rounded-[2rem] bg-navy px-8 py-12 text-start text-white md:px-14 md:py-14">
              <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/40">
                {t(locale, "governanceEyebrow")}
              </p>
              <p className="mt-5 max-w-2xl text-xl leading-relaxed text-white/85 md:text-2xl">
                {t(locale, "governanceClose")}
              </p>
              <Link
                href={pagePath(locale, "/contact")}
                className="btn-lift mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-brand hover:text-white"
              >
                {t(locale, "getInTouch")}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
