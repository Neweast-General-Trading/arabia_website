import localFont from "next/font/local";
import { Manrope, Outfit } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const gess = localFont({
  src: [
    { path: "../../public/fonts/GESS-Light.otf", weight: "300", style: "normal" },
    { path: "../../public/fonts/GESS-Medium.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/GESS-Medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/GESS-Bold.otf", weight: "600", style: "normal" },
    { path: "../../public/fonts/GESS-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-arabic",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://arabia.neweast.cloud"),
  title: "Neweast Arabia Holding",
  description: "Holding company showcase for Neweast businesses in Saudi Arabia.",
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = (await headers()).get("x-locale") || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${outfit.variable} ${manrope.variable} ${gess.variable} h-full antialiased`}>
      <body className="relative min-h-full flex flex-col bg-sand font-sans text-ink">{children}</body>
    </html>
  );
}
