"use client";

import { useState } from "react";
import { mediaUrl } from "@/lib/api";

export function Moments({
  items,
  hint,
}: {
  items: { src: string; label: string; href: string }[];
  hint: string;
}) {
  const [active, setActive] = useState(0);
  if (items.length < 2) return null;

  return (
    <div className="flex h-[240px] gap-3 overflow-hidden md:h-[420px]">
      {items.map((item, i) => {
        const open = active === i;
        return (
          <a
            key={`${item.href}-${i}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={(e) => {
              if (window.matchMedia("(hover: none)").matches && !open) {
                e.preventDefault();
                setActive(i);
              }
            }}
            className={`group relative min-w-0 overflow-hidden rounded-[1.6rem] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "flex-[1.9]" : "flex-1"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(item.src)}
              alt={item.label}
              className={`h-full w-full object-cover transition-transform duration-[1400ms] ${
                open ? "scale-110" : "scale-100"
              }`}
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/15 to-transparent transition-opacity duration-500 ${
                open ? "opacity-90" : "opacity-55"
              }`}
            />
            <div
              className={`absolute inset-x-0 bottom-0 p-5 transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"
              }`}
            >
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/60">{hint}</p>
              <p className="mt-1 font-heading text-sm text-white md:text-lg">{item.label}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
