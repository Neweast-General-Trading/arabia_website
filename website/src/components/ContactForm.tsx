"use client";

import { useState } from "react";
import type { Locale, Settings } from "@/lib/types";
import { API_URL } from "@/lib/api";
import { t } from "@/lib/i18n";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

export function ContactForm({ locale, settings }: { locale: Locale; settings: Settings }) {
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "missing">("idle");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !data.message) {
      setStatus("missing");
      return;
    }
    setPending(true);
    try {
      const res = await fetch(`${API_URL}/api/public/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const json = await res.json();
      setStatus(json.ok ? "ok" : "error");
      if (json.ok) form.reset();
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-navy">
          {t(locale, "name")}
          <input name="name" required autoComplete="name" className="input-light font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {t(locale, "email")}
          <input name="email" type="email" required autoComplete="email" dir="ltr" className="input-light font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {t(locale, "phone")}
          <input name="phone" autoComplete="tel" dir="ltr" className="input-light font-normal" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {t(locale, "subject")}
          <input name="subject" className="input-light font-normal" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium text-navy">
        {t(locale, "message")}
        <textarea name="message" required rows={6} className="input-light min-h-[160px] resize-y font-normal" />
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button
          disabled={pending}
          className="btn-lift inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {pending ? <LoaderCircle size={16} className="animate-spin" /> : null}
          {t(locale, "sendMessage")}
          {!pending && <ArrowUpRight size={16} className="dir-out" />}
        </button>
        {status === "ok" && <p className="text-sm font-medium text-emerald-700">{t(locale, "sent")}</p>}
        {status === "error" && <p className="text-sm font-medium text-brand">{t(locale, "sendError")}</p>}
        {status === "missing" && <p className="text-sm font-medium text-brand">{t(locale, "required")}</p>}
      </div>
      <p className="text-xs text-muted">
        {t(locale, "emailUs")}:{" "}
        <a className="underline decoration-line underline-offset-4 hover:text-navy" href={`mailto:${settings.email}`}>
          {settings.email}
        </a>
      </p>
    </form>
  );
}
