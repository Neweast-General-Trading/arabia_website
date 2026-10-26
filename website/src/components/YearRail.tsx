"use client";

import { useEffect, useState } from "react";

export function YearRail({ items }: { items: { id: string; year: string }[] }) {
  const [active, setActive] = useState(items[0]?.id || "");

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(`story-${item.id}`))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id.replace("story-", "");
        if (id) setActive(id);
      },
      { threshold: [0.35, 0.55], rootMargin: "-18% 0px -42% 0px" },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <div className="mb-8 flex flex-wrap justify-start gap-2">
      {items.map((item) => {
        const on = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              document.getElementById(`story-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
              on ? "bg-navy text-white shadow-[0_10px_24px_rgba(17,24,39,0.16)]" : "bg-white text-navy/60 hover:text-navy"
            }`}
          >
            {item.year}
          </button>
        );
      })}
    </div>
  );
}
