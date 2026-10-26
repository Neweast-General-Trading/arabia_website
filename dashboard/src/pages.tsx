import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cmsPath, mediaUrl, request } from "./api";

export function OverviewPage() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    request("/api/admin/stats").then(setStats);
  }, []);

  const cards = [
    { label: "Unread messages", value: stats?.unread ?? "–", to: "/messages" },
    { label: "All messages", value: stats?.messages ?? "–", to: "/messages" },
    { label: "Media files", value: stats?.media ?? "–", to: "/media" },
    { label: "Hero banners", value: stats?.banners ?? "–", to: "/banners" },
    { label: "Subsidiaries", value: stats?.subsidiaries ?? "–", to: "/subsidiaries" },
  ];

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Overview</h1>
      <p className="mb-6 text-muted">Manage every public page, image and SEO field from this dashboard.</p>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-3xl font-bold text-navy">{card.value}</div>
            <div className="mt-1 text-sm text-muted">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LoginPage() {
  const [email, setEmail] = useState("admin@neweast.sa");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
      const res = await request<{ token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("ne_token", res.token);
      window.location.href = cmsPath("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl bg-white p-8">
        <div className="text-xs font-bold tracking-[0.2em] text-brand">NEWEAST ARABIA</div>
        <h1 className="text-2xl font-bold">CMS Login</h1>
        <input className="w-full rounded-lg border border-line px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full rounded-lg border border-line px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-brand">{error}</p>}
        <button disabled={pending} className="w-full rounded-lg bg-navy py-3 font-bold text-white">
          Sign in
        </button>
      </form>
    </div>
  );
}

export function MediaPage() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    setItems(await request("/api/admin/media"));
  }
  useEffect(() => {
    load();
  }, []);
  async function upload(file: File) {
    const form = new FormData();
    form.append("file", file);
    await request("/api/admin/media", { method: "POST", body: form });
    await load();
  }
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Media library</h1>
        <label className="cursor-pointer rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white">
          Upload
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl bg-white shadow-sm">
            <img src={mediaUrl(item.url)} alt={item.original} className="h-36 w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-xs">
              <span className="truncate">{item.original}</span>
              <button
                className="text-brand"
                onClick={async () => {
                  if (!confirm("Delete file?")) return;
                  await request(`/api/admin/media/${item.id}`, { method: "DELETE" });
                  await load();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessagesPage() {
  const [items, setItems] = useState<any[]>([]);
  async function load() {
    setItems(await request("/api/admin/messages"));
  }
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Contact messages</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className={`rounded-xl bg-white p-4 ${item.read ? "opacity-70" : ""}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>{item.name}</strong>
              <span className="text-xs text-muted">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted">{item.email} {item.phone ? `· ${item.phone}` : ""}</div>
            {item.subject && <div className="mt-1 font-semibold">{item.subject}</div>}
            <p className="mt-2 text-sm leading-6">{item.message}</p>
            <div className="mt-3 flex gap-3 text-sm">
              <button
                className="font-semibold text-navy"
                onClick={async () => {
                  await request(`/api/admin/messages/${item.id}/read`, { method: "PATCH", body: JSON.stringify({ read: !item.read }) });
                  await load();
                }}
              >
                {item.read ? "Mark unread" : "Mark read"}
              </button>
              <button
                className="text-brand"
                onClick={async () => {
                  if (!confirm("Delete message?")) return;
                  await request(`/api/admin/messages/${item.id}`, { method: "DELETE" });
                  await load();
                }}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
        {!items.length && <p className="text-muted">No messages yet.</p>}
      </div>
    </div>
  );
}

export function SeoPage() {
  const { lang } = useOutletContextSafe();
  const [pages, setPages] = useState<any[]>([]);
  const [active, setActive] = useState<string>("home");
  useEffect(() => {
    request<any[]>("/api/admin/pages").then((data) => {
      setPages(data);
      setActive(data[0]?.slug || "home");
    });
  }, []);
  const current = pages.find((p) => p.slug === active);
  async function save() {
    if (!current) return;
    const saved = await request(`/api/admin/pages/${current.slug}`, {
      method: "PUT",
      body: JSON.stringify({
        title: current.title,
        description: current.description,
        keywords: current.keywords,
        ogImage: current.ogImage,
      }),
    });
    setPages(pages.map((p) => (p.slug === saved.slug ? saved : p)));
  }
  if (!current) return <p>Loading…</p>;
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Pages & SEO</h1>
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          {pages.map((p) => (
            <button key={p.slug} onClick={() => setActive(p.slug)} className={`block w-full rounded-lg px-3 py-2 text-start text-sm font-semibold ${p.slug === active ? "bg-navy text-white" : "bg-white"}`}>
              {p.slug}
            </button>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl bg-white p-5">
          <BiFieldSafe lang={lang} label="SEO title" value={current.title} onChange={(v) => setPages(pages.map((p) => p.slug === active ? { ...p, title: v } : p))} />
          <BiFieldSafe lang={lang} label="Meta description" rows={4} value={current.description} onChange={(v) => setPages(pages.map((p) => p.slug === active ? { ...p, description: v } : p))} />
          <BiFieldSafe lang={lang} label="Keywords" value={current.keywords} onChange={(v) => setPages(pages.map((p) => p.slug === active ? { ...p, keywords: v } : p))} />
          <ImagePickerSafe value={current.ogImage} onChange={(v) => setPages(pages.map((p) => p.slug === active ? { ...p, ogImage: v } : p))} />
          <button onClick={save} className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white">Save page SEO</button>
        </div>
      </div>
    </div>
  );
}

function useOutletContextSafe() {
  try {
    const { useOutletContext } = require("react-router-dom") as typeof import("react-router-dom");
    return useOutletContext<{ lang: "en" | "ar" }>();
  } catch {
    return { lang: "en" as const };
  }
}

function BiFieldSafe(props: any) {
  const { BiField } = require("./ui") as typeof import("./ui");
  return <BiField {...props} />;
}
function ImagePickerSafe(props: any) {
  const { ImagePicker } = require("./ui") as typeof import("./ui");
  return <ImagePicker label="Open Graph image" {...props} />;
}

export function AccountPage() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [status, setStatus] = useState("");
  return (
    <form
      className="max-w-md space-y-4 rounded-2xl bg-white p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        await request("/api/auth/password", {
          method: "POST",
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        setStatus("Password updated");
        setCurrent("");
        setNew("");
      }}
    >
      <h1 className="text-2xl font-bold">Account</h1>
      <input type="password" placeholder="Current password" className="w-full rounded-lg border border-line px-3 py-2" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} />
      <input type="password" placeholder="New password" className="w-full rounded-lg border border-line px-3 py-2" value={newPassword} onChange={(e) => setNew(e.target.value)} />
      <button className="rounded-lg bg-navy px-4 py-2 font-bold text-white">Update password</button>
      {status && <p className="text-sm text-emerald-700">{status}</p>}
    </form>
  );
}
