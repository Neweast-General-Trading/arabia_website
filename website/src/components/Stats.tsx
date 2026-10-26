"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale, Stat } from "@/lib/types";
import { Reveal } from "@/components/Reveal";
import { localizeDigits, toWesternDigits } from "@/lib/digits";

function parseStat(value: string) {
  const match = toWesternDigits(value).match(/^(\d+)(\+)?$/);
  if (!match) return null;
  const n = Number(match[1]);
  if (n >= 1900 && n <= 2100) return null;
  return { n, plus: Boolean(match[2]) };
}

function StatValue({ value, locale }: { value: string; locale: Locale }) {
  const parsed = parseStat(value);
  const [shown, setShown] = useState(parsed ? 0 : null);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!parsed) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const duration = 1100;
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - p) ** 3;
          setShown(Math.round(parsed.n * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [parsed]);

  if (!parsed || shown === null) {
    return <div className="font-heading text-4xl font-bold text-navy md:text-5xl">{localizeDigits(value, locale)}</div>;
  }

  return (
    <div ref={ref} className="font-heading text-4xl font-bold text-navy md:text-5xl">
      {localizeDigits(`${shown}${parsed.plus ? "+" : ""}`, locale)}
    </div>
  );
}

export function Stats({ stats, locale }: { stats: Stat[]; locale: Locale }) {
  if (!stats.length) return null;

  return (
    <section className="bg-sand py-16">
      <div className="container-wide grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={`${stat.label}-${stat.value}`} delay={i * 80}>
            <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-[0_10px_30px_rgba(17,24,39,0.04)] transition-transform duration-500 hover:-translate-y-1">
              <div className="mx-auto mb-4 h-0.5 w-8 bg-brand" />
              <StatValue value={stat.value} locale={locale} />
              <div className="mt-2 text-xs font-semibold tracking-[0.16em] uppercase text-muted">{stat.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
