import { NavLink, Outlet } from "react-router-dom";
import {
  Building2,
  Contact,
  Flag,
  GalleryHorizontal,
  Globe,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Search,
  Settings,
  Shield,
  Users,
  Waypoints,
} from "lucide-react";
import { useAuth } from "./auth";
import { WEBSITE } from "./api";
import { LangSwitch } from "./ui";
import { useState } from "react";

const links = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/settings", label: "Site settings", icon: Settings },
  { to: "/banners", label: "Hero banners", icon: GalleryHorizontal },
  { to: "/pillars", label: "Strategy pillars", icon: Flag },
  { to: "/story", label: "Our story", icon: Waypoints },
  { to: "/values", label: "Values", icon: Shield },
  { to: "/leadership", label: "Leadership", icon: Users },
  { to: "/governance", label: "Governance", icon: Building2 },
  { to: "/subsidiaries", label: "Subsidiaries", icon: Globe },
  { to: "/seo", label: "Pages & SEO", icon: Search },
  { to: "/media", label: "Media library", icon: ImageIcon },
  { to: "/messages", label: "Contact messages", icon: Mail },
  { to: "/account", label: "Account", icon: Contact },
];

export function Shell() {
  const { user, logout } = useAuth();
  const [lang, setLang] = useState<"en" | "ar">("en");

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col bg-navy text-white">
        <div className="border-b border-white/10 px-5 py-5">
          <div className="text-xs font-bold tracking-[0.2em] text-brand">NEWEAST ARABIA</div>
          <div className="mt-1 text-sm text-white/70">Content Manager</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-auto p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isActive ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`
              }
            >
              <link.icon size={16} />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4 text-sm">
          <div className="text-white/60">{user?.email}</div>
          <button onClick={logout} className="mt-3 inline-flex items-center gap-2 text-white/80 hover:text-white">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-line bg-white px-6 py-4">
          <LangSwitch lang={lang} setLang={setLang} />
          <a href={WEBSITE} target="_blank" rel="noreferrer" className="text-sm font-semibold text-brand">
            View website
          </a>
        </header>
        <div className="flex-1 overflow-auto p-6">
          <Outlet context={{ lang }} />
        </div>
      </div>
    </div>
  );
}
