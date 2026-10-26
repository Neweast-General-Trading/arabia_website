import { mediaUrl } from "@/lib/api";

export function BrandMarquee({
  items,
}: {
  items: { name: string; logo?: string | null }[];
}) {
  const logos = items.filter((item) => item.logo);
  if (!logos.length) return null;

  const row = Array.from({ length: 8 }, () => logos).flat();

  return (
    <div className="marquee relative overflow-hidden border-y border-line bg-white py-6" dir="ltr">
      <div className="marquee-track flex w-max items-center gap-14">
        {row.map((item, i) => (
          <div key={`${item.name}-${i}`} className="flex shrink-0 items-center gap-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(item.logo)}
              alt=""
              className="h-8 w-auto max-w-[140px] object-contain"
            />
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </div>
        ))}
      </div>
    </div>
  );
}
