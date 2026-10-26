import { useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { request } from "./api";
import { BiField, ImagePicker } from "./ui";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

type Lang = "en" | "ar";
type Bi = { en: string; ar: string };

type Field =
  | { key: string; type: "bi"; label: string; rows?: number }
  | { key: string; type: "text"; label: string }
  | { key: string; type: "image"; label: string }
  | { key: string; type: "bool"; label: string }
  | { key: string; type: "icon"; label: string };

const ICONS = ["flag", "layers", "handshake", "trending-up", "shield", "award", "users", "sparkles"];

export function CrudPage({
  title,
  resource,
  fields,
  defaults,
}: {
  title: string;
  resource: string;
  fields: Field[];
  defaults: Record<string, unknown>;
}) {
  const { lang } = useOutletContext<{ lang: Lang }>();
  const [items, setItems] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const data = await request<any[]>(`/api/admin/content/${resource}`);
    setItems(data);
    setActiveId((id) => id || data[0]?.id || null);
  }

  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [resource]);

  const current = items.find((i) => i.id === activeId);

  async function save(next: any) {
    const { id, createdAt, updatedAt, ...body } = next;
    void createdAt;
    void updatedAt;
    await request(`/api/admin/content/${resource}/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    await load();
  }

  async function create() {
    const created = await request<any>(`/api/admin/content/${resource}`, {
      method: "POST",
      body: JSON.stringify({ ...defaults, sortOrder: items.length }),
    });
    await load();
    setActiveId(created.id);
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await request(`/api/admin/content/${resource}/${id}`, { method: "DELETE" });
    setActiveId(null);
    await load();
  }

  async function move(id: string, dir: -1 | 1) {
    const ids = items.map((i) => i.id);
    const i = ids.indexOf(id);
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    await request(`/api/admin/content/${resource}/reorder`, {
      method: "PATCH",
      body: JSON.stringify({ ids }),
    });
    await load();
  }

  function patch(key: string, value: unknown) {
    if (!current) return;
    const next = { ...current, [key]: value };
    setItems(items.map((i) => (i.id === current.id ? next : i)));
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button onClick={create} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white">
          <Plus size={16} /> Add
        </button>
      </div>
      {error && <p className="mb-3 text-brand">{error}</p>}
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={item.id} className={`flex items-center gap-2 rounded-xl border p-3 ${item.id === activeId ? "border-brand bg-white" : "border-line bg-white/70"}`}>
              <button className="flex-1 text-start text-sm font-semibold" onClick={() => setActiveId(item.id)}>
                {item.title?.en || item.name?.en || item.year || `Item ${index + 1}`}
              </button>
              <button onClick={() => move(item.id, -1)}><ArrowUp size={14} /></button>
              <button onClick={() => move(item.id, 1)}><ArrowDown size={14} /></button>
            </div>
          ))}
        </div>
        {current && (
          <form
            className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              save(current);
            }}
          >
            {fields.map((field) => {
              if (field.type === "bi") {
                return (
                  <BiField
                    key={field.key}
                    label={field.label}
                    lang={lang}
                    rows={field.rows}
                    value={current[field.key] as Bi}
                    onChange={(v) => patch(field.key, v)}
                  />
                );
              }
              if (field.type === "image") {
                return (
                  <ImagePicker
                    key={field.key}
                    label={field.label}
                    value={current[field.key]}
                    onChange={(v) => patch(field.key, v)}
                  />
                );
              }
              if (field.type === "bool") {
                return (
                  <label key={field.key} className="flex items-center gap-2 text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={!!current[field.key]}
                      onChange={(e) => patch(field.key, e.target.checked)}
                    />
                    {field.label}
                  </label>
                );
              }
              if (field.type === "icon") {
                return (
                  <label key={field.key} className="grid gap-1 text-sm font-semibold">
                    {field.label}
                    <select
                      className="rounded-lg border border-line px-3 py-2"
                      value={current[field.key] || ""}
                      onChange={(e) => patch(field.key, e.target.value)}
                    >
                      {ICONS.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </label>
                );
              }
              return (
                <label key={field.key} className="grid gap-1 text-sm font-semibold">
                  {field.label}
                  <input
                    className="rounded-lg border border-line px-3 py-2"
                    value={current[field.key] || ""}
                    onChange={(e) => patch(field.key, e.target.value)}
                  />
                </label>
              );
            })}
            <div className="flex gap-3">
              <button className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white">Save</button>
              <button type="button" onClick={() => remove(current.id)} className="inline-flex items-center gap-1 text-sm text-brand">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
