import { mediaUrl } from "@/lib/api";

export function BrandBadge({
  src,
  alt = "",
  size = "sm",
}: {
  src: string | null | undefined;
  alt?: string;
  size?: "sm" | "md";
}) {
  if (!src) return null;
  const box =
    size === "md"
      ? "h-[3.4rem] w-[7.2rem] px-2.5 md:h-16 md:w-[8.5rem]"
      : "h-12 w-[6.4rem] px-2 md:h-[3.35rem] md:w-[7rem]";

  return (
    <div
      className={`absolute left-3 top-3 z-10 flex ${box} items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(17,24,39,0.18)]`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mediaUrl(src)}
        alt={alt}
        className="max-h-[72%] max-w-[86%] object-contain"
      />
    </div>
  );
}
