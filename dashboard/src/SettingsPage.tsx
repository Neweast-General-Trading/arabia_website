import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { emptyBi, request } from "./api";
import { BiField, Field, ImagePicker } from "./ui";

type Lang = "en" | "ar";

export function SettingsPage() {
  const { lang } = useOutletContext<{ lang: Lang }>();
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    request<Record<string, any>>("/api/admin/settings").then(setData);
  }, []);

  function patch(key: string, value: unknown) {
    if (!data) return;
    setData({ ...data, [key]: value });
  }

  async function save() {
    if (!data) return;
    await request("/api/admin/settings", { method: "PUT", body: JSON.stringify(data) });
    setStatus("Saved");
    setTimeout(() => setStatus(""), 2000);
  }

  if (!data) return <p>Loading…</p>;

  const stats = Array.isArray(data.stats) ? data.stats : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Site settings</h1>
        <button onClick={save} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white">
          {status || "Save all"}
        </button>
      </div>

      <section className="space-y-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">Branding</h2>
        <BiField label="Company name" lang={lang} value={data.companyName} onChange={(v) => patch("companyName", v)} />
        <BiField label="Tagline" lang={lang} rows={2} value={data.tagline} onChange={(v) => patch("tagline", v)} />
        <ImagePicker label="Logo (light backgrounds)" value={data.logoLight} onChange={(v) => patch("logoLight", v)} />
        <ImagePicker label="Logo (dark backgrounds)" value={data.logoDark} onChange={(v) => patch("logoDark", v)} />
        <ImagePicker label="Favicon" value={data.favicon} onChange={(v) => patch("favicon", v)} />
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Primary color">
            <input className="rounded-lg border border-line px-3 py-2" value={data.primaryColor || ""} onChange={(e) => patch("primaryColor", e.target.value)} />
          </Field>
          <Field label="Secondary color">
            <input className="rounded-lg border border-line px-3 py-2" value={data.secondaryColor || ""} onChange={(e) => patch("secondaryColor", e.target.value)} />
          </Field>
          <Field label="Accent color">
            <input className="rounded-lg border border-line px-3 py-2" value={data.accentColor || ""} onChange={(e) => patch("accentColor", e.target.value)} />
          </Field>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">Contact</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Email">
            <input className="rounded-lg border border-line px-3 py-2" value={data.email || ""} onChange={(e) => patch("email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input className="rounded-lg border border-line px-3 py-2" value={data.phone || ""} onChange={(e) => patch("phone", e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className="rounded-lg border border-line px-3 py-2" value={data.whatsapp || ""} onChange={(e) => patch("whatsapp", e.target.value)} />
          </Field>
          <Field label="Website URL (canonical)">
            <input className="rounded-lg border border-line px-3 py-2" value={data.siteUrl || ""} onChange={(e) => patch("siteUrl", e.target.value)} />
          </Field>
        </div>
        <BiField label="Address" lang={lang} rows={2} value={data.address} onChange={(v) => patch("address", v)} />
        <Field label="Google Maps embed URL">
          <input className="rounded-lg border border-line px-3 py-2" value={data.mapEmbedUrl || ""} onChange={(e) => patch("mapEmbedUrl", e.target.value)} />
        </Field>
      </section>

      <section className="space-y-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">Home — Who we are</h2>
        <BiField label="Eyebrow" lang={lang} value={data.whoWeAreEyebrow} onChange={(v) => patch("whoWeAreEyebrow", v)} />
        <BiField label="Title" lang={lang} value={data.whoWeAreTitle} onChange={(v) => patch("whoWeAreTitle", v)} />
        <BiField label="Body" lang={lang} rows={6} value={data.whoWeAreBody} onChange={(v) => patch("whoWeAreBody", v)} />
        <ImagePicker label="Section image" value={data.whoWeAreImage} onChange={(v) => patch("whoWeAreImage", v)} />
        <div>
          <div className="mb-2 font-semibold">Stats bar</div>
          {stats.map((stat: any, i: number) => (
            <div key={i} className="mb-3 grid gap-2 rounded-lg border border-line p-3 md:grid-cols-3">
              <input className="rounded-lg border border-line px-3 py-2" value={stat.value || ""} onChange={(e) => {
                const next = [...stats];
                next[i] = { ...next[i], value: e.target.value };
                patch("stats", next);
              }} />
              <BiField label="Label" lang={lang} value={stat.label} onChange={(v) => {
                const next = [...stats];
                next[i] = { ...next[i], label: v };
                patch("stats", next);
              }} />
              <button className="text-sm text-brand" onClick={() => patch("stats", stats.filter((_: unknown, idx: number) => idx !== i))}>Remove</button>
            </div>
          ))}
          <button className="text-sm font-bold text-navy" onClick={() => patch("stats", [...stats, { value: "", label: emptyBi() }])}>+ Add stat</button>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">About — overview, mission, vision</h2>
        <BiField label="Overview title" lang={lang} value={data.overviewTitle} onChange={(v) => patch("overviewTitle", v)} />
        <BiField label="Overview body" lang={lang} rows={6} value={data.overviewBody} onChange={(v) => patch("overviewBody", v)} />
        <ImagePicker label="Overview image" value={data.overviewImage} onChange={(v) => patch("overviewImage", v)} />
        <BiField label="Mission title" lang={lang} value={data.missionTitle} onChange={(v) => patch("missionTitle", v)} />
        <BiField label="Mission body" lang={lang} rows={4} value={data.missionBody} onChange={(v) => patch("missionBody", v)} />
        <BiField label="Vision title" lang={lang} value={data.visionTitle} onChange={(v) => patch("visionTitle", v)} />
        <BiField label="Vision body" lang={lang} rows={4} value={data.visionBody} onChange={(v) => patch("visionBody", v)} />
      </section>

      <section className="space-y-4 rounded-2xl bg-white p-5">
        <h2 className="font-bold">Footer, social & SEO defaults</h2>
        <BiField label="Footer about" lang={lang} rows={3} value={data.footerAbout} onChange={(v) => patch("footerAbout", v)} />
        <BiField label="Copyright" lang={lang} value={data.copyright} onChange={(v) => patch("copyright", v)} />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="LinkedIn"><input className="rounded-lg border border-line px-3 py-2" value={data.linkedin || ""} onChange={(e) => patch("linkedin", e.target.value)} /></Field>
          <Field label="X / Twitter"><input className="rounded-lg border border-line px-3 py-2" value={data.twitter || ""} onChange={(e) => patch("twitter", e.target.value)} /></Field>
          <Field label="Instagram"><input className="rounded-lg border border-line px-3 py-2" value={data.instagram || ""} onChange={(e) => patch("instagram", e.target.value)} /></Field>
          <Field label="YouTube"><input className="rounded-lg border border-line px-3 py-2" value={data.youtube || ""} onChange={(e) => patch("youtube", e.target.value)} /></Field>
        </div>
        <BiField label="Default SEO title" lang={lang} value={data.seoTitle} onChange={(v) => patch("seoTitle", v)} />
        <BiField label="Default SEO description" lang={lang} rows={3} value={data.seoDescription} onChange={(v) => patch("seoDescription", v)} />
        <BiField label="Default keywords" lang={lang} value={data.seoKeywords} onChange={(v) => patch("seoKeywords", v)} />
        <ImagePicker label="Default Open Graph image" value={data.ogImage} onChange={(v) => patch("ogImage", v)} />
        <Field label="Analytics ID">
          <input className="rounded-lg border border-line px-3 py-2" value={data.analyticsId || ""} onChange={(e) => patch("analyticsId", e.target.value)} />
        </Field>
      </section>
    </div>
  );
}
