import { useEffect, useState, type ReactNode } from "react";
import { mediaUrl, request } from "./api";

type MediaItem = {
  id: string;
  url: string;
  original: string;
  mimeType: string;
};

export function ImagePicker({
  value,
  onChange,
  label,
}: {
  value?: string | null;
  onChange: (url: string) => void;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);

  async function load() {
    setItems(await request<MediaItem[]>("/api/admin/media"));
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  async function onUpload(file: File) {
    const form = new FormData();
    form.append("file", file);
    const created = await request<MediaItem>("/api/admin/media", { method: "POST", body: form });
    onChange(created.url);
    setOpen(false);
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-semibold">{label}</span>
      <div className="flex items-center gap-3">
        <div className="h-20 w-28 overflow-hidden rounded-lg border border-line bg-white">
          {value ? <img src={mediaUrl(value)} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-xs text-muted">No image</div>}
        </div>
        <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-navy px-3 py-2 text-sm text-white">
          Choose / upload
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-sm text-brand">
            Remove
          </button>
        )}
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">Media library</h3>
              <label className="cursor-pointer rounded-lg bg-brand px-3 py-2 text-sm text-white">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onUpload(file);
                  }}
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setOpen(false);
                  }}
                  className="overflow-hidden rounded-lg border border-line hover:ring-2 hover:ring-brand"
                >
                  <img src={mediaUrl(item.url)} alt={item.original} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BiField({
  label,
  value,
  onChange,
  lang,
  rows,
}: {
  label: string;
  value: { en?: string; ar?: string } | null | undefined;
  onChange: (v: { en: string; ar: string }) => void;
  lang: "en" | "ar";
  rows?: number;
}) {
  const current = value || { en: "", ar: "" };
  const text = current[lang] || "";
  const cls = "w-full rounded-lg border border-line bg-white px-3 py-2";
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label} <span className="font-normal text-muted">({lang.toUpperCase()})</span>
      {rows ? (
        <textarea
          rows={rows}
          className={cls}
          dir={lang === "ar" ? "rtl" : "ltr"}
          value={text}
          onChange={(e) => onChange({ en: current.en || "", ar: current.ar || "", [lang]: e.target.value })}
        />
      ) : (
        <input
          className={cls}
          dir={lang === "ar" ? "rtl" : "ltr"}
          value={text}
          onChange={(e) => onChange({ en: current.en || "", ar: current.ar || "", [lang]: e.target.value })}
        />
      )}
    </label>
  );
}

export function LangSwitch({ lang, setLang }: { lang: "en" | "ar"; setLang: (v: "en" | "ar") => void }) {
  return (
    <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
      {(["en", "ar"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLang(item)}
          className={`rounded-full px-4 py-1.5 text-sm font-bold ${lang === item ? "bg-navy text-white" : "text-navy"}`}
        >
          {item === "en" ? "English" : "العربية"}
        </button>
      ))}
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
