import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { getSite } from "@/lib/api";
import { t } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  return buildMetadata(await getSite(locale as Locale), "contact", locale as Locale, "/contact");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale === "ar" ? "ar" : "en";
  const site = await getSite(locale);
  const s = site.settings;
  const tel = s.phone.replace(/\s/g, "");

  const cards = [
    { icon: MapPin, label: t(locale, "visitOffice"), value: s.address, href: s.mapEmbedUrl || undefined, external: true },
    { icon: Mail, label: t(locale, "emailUs"), value: s.email, href: `mailto:${s.email}` },
    { icon: Phone, label: t(locale, "callUs"), value: s.phone, href: `tel:${tel}` },
  ];

  return (
    <>
      <PageHero eyebrow={t(locale, "getInTouch")} title={t(locale, "partnerTitle")} description={t(locale, "partnerBody")} />
      <section className="bg-sand pb-24 pt-4">
        <div className="container-wide">
          <div className="grid gap-5 md:grid-cols-3">
            {cards.map((card, i) => {
              const Icon = card.icon;
              const inner = (
                <>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon size={18} />
                  </span>
                  <p className="mt-5 text-[11px] font-semibold tracking-[0.16em] uppercase text-muted">{card.label}</p>
                  <p className="mt-2 text-base leading-7 text-navy">{card.value}</p>
                </>
              );
              return (
                <Reveal key={card.label} delay={i * 90} from={i === 1 ? "scale" : "up"}>
                  {card.href ? (
                    <TiltCard>
                    <a
                      href={card.href}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noopener noreferrer" : undefined}
                      className="card block rounded-[1.6rem] p-7 text-start"
                    >
                      {inner}
                    </a>
                    </TiltCard>
                  ) : (
                    <div className="card rounded-[1.6rem] p-7">{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>

          <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <div className="h-full rounded-[2rem] bg-white p-8 text-start shadow-[0_20px_50px_rgba(17,24,39,0.05)] md:p-12">
                <p className="eyebrow">{t(locale, "getInTouch")}</p>
                <h2 className="section-title mt-4">{t(locale, "sendAMessage")}</h2>
                <p className="prose-body mt-4 max-w-xl">{t(locale, "formHint")}</p>
                <div className="mt-8">
                  <ContactForm locale={locale} settings={s} />
                </div>
              </div>
            </Reveal>
            <Reveal delay={120} className="h-full min-h-[420px]">
              <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] lg:min-h-full">
                {s.mapEmbedUrl && (
                  <iframe
                    title={s.address}
                    src={s.mapEmbedUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent p-6">
                  <p className="pointer-events-auto text-sm font-medium text-white">{s.address}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
