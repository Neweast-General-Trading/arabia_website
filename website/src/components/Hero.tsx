"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import type { Banner, Locale } from "@/lib/types";
import { mediaUrl, pagePath } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Hero({
  banners,
  locale,
  companyName,
}: {
  banners: Banner[];
  locale: Locale;
  companyName: string;
}) {
  const [index, setIndex] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const slides = banners.length ? banners : [];

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, [slides.length, index]);

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--px", `${x * 18}px`);
    el.style.setProperty("--py", `${y * 12}px`);
  }

  function onLeave() {
    const el = frame.current;
    if (!el) return;
    el.style.setProperty("--px", "0px");
    el.style.setProperty("--py", "0px");
  }

  if (!slides.length) return null;
  const slide = slides[index];
  const href = slide.ctaLink?.startsWith("http")
    ? slide.ctaLink
    : pagePath(locale, slide.ctaLink || "/");
  const external = slide.ctaLink?.startsWith("http");

  return (
    <section className="bg-white pb-8 pt-10 md:pb-14 md:pt-16">
      <div className="container-wide grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16">
        <div key={slide.id} className="hero-copy text-start">
          <p className="eyebrow">{companyName}</p>
          <h1 className="mt-5 max-w-xl font-heading text-4xl font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.35rem]">
            {slide.title}
          </h1>
          <p className="prose-body mt-6 max-w-lg">{slide.subtitle}</p>
          {slide.ctaLabel && (
            external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lift mt-8 inline-flex w-fit rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {slide.ctaLabel}
              </a>
            ) : (
              <Link
                href={href}
                className="btn-lift mt-8 inline-flex w-fit rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                {slide.ctaLabel}
              </Link>
            )
          )}

          {slides.length > 1 && (
            <div className="mt-10 max-w-md">
              <div className="mb-5 h-[2px] overflow-hidden rounded-full bg-navy/10">
                <div key={slide.id} className="hero-progress" />
              </div>
              <div className="flex items-center gap-3">
                <button
                  aria-label="Previous"
                  onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                  className="rounded-full border border-line p-2 text-navy transition hover:border-navy hover:bg-sand"
                >
                  <ChevronLeft size={16} className="dir-prev" />
                </button>
                <div className="flex gap-2">
                  {slides.map((s, i) => (
                    <button
                      key={s.id}
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`relative h-12 w-16 overflow-hidden rounded-lg border transition-all ${
                        i === index ? "border-brand ring-2 ring-brand/20" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(s.image)} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
                <button
                  aria-label="Next"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="rounded-full border border-line p-2 text-navy transition hover:border-navy hover:bg-sand"
                >
                  <ChevronRight size={16} className="dir-next" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          ref={frame}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="hero-frame hero-parallax relative h-[340px] overflow-hidden rounded-[2rem] shadow-[0_30px_60px_rgba(17,24,39,0.12)] md:h-[500px]"
        >
          {slides.map((item, i) => (
            <div
              key={item.id}
              className={`absolute inset-0 overflow-hidden transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaUrl(item.image)}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div className="media-shade" />
          <span className="absolute start-0 top-8 h-16 w-1 bg-brand" />
        </div>
      </div>
    </section>
  );
}
