import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth";
import { Shell } from "./Shell";
import { CrudPage } from "./CrudPage";
import { emptyBi } from "./api";
import {
  AccountPage,
  LoginPage,
  MediaPage,
  MessagesPage,
  OverviewPage,
  SeoPage,
} from "./pages";
import { SettingsPage } from "./SettingsPage";

function Guard() {
  const { user, ready } = useAuth();
  if (!ready) return <div className="grid min-h-screen place-items-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Guard />}>
            <Route element={<Shell />}>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route
                path="/banners"
                element={
                  <CrudPage
                    title="Hero banners"
                    resource="banners"
                    defaults={{
                      title: emptyBi(),
                      subtitle: emptyBi(),
                      ctaLabel: emptyBi(),
                      ctaLink: "",
                      image: "",
                      active: true,
                    }}
                    fields={[
                      { key: "title", type: "bi", label: "Title" },
                      { key: "subtitle", type: "bi", label: "Subtitle", rows: 3 },
                      { key: "ctaLabel", type: "bi", label: "Button label" },
                      { key: "ctaLink", type: "text", label: "Button link" },
                      { key: "image", type: "image", label: "Banner image" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/pillars"
                element={
                  <CrudPage
                    title="Strategy pillars"
                    resource="pillars"
                    defaults={{ title: emptyBi(), body: emptyBi(), icon: "flag", image: "", active: true }}
                    fields={[
                      { key: "title", type: "bi", label: "Title" },
                      { key: "body", type: "bi", label: "Body", rows: 4 },
                      { key: "icon", type: "icon", label: "Icon" },
                      { key: "image", type: "image", label: "Image" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/story"
                element={
                  <CrudPage
                    title="Our story"
                    resource="story"
                    defaults={{ year: "", title: emptyBi(), body: emptyBi(), image: "", active: true }}
                    fields={[
                      { key: "year", type: "text", label: "Year" },
                      { key: "title", type: "bi", label: "Title" },
                      { key: "body", type: "bi", label: "Body", rows: 4 },
                      { key: "image", type: "image", label: "Image" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/values"
                element={
                  <CrudPage
                    title="Values"
                    resource="values"
                    defaults={{ title: emptyBi(), body: emptyBi(), icon: "shield", active: true }}
                    fields={[
                      { key: "title", type: "bi", label: "Title" },
                      { key: "body", type: "bi", label: "Body", rows: 4 },
                      { key: "icon", type: "icon", label: "Icon" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/leadership"
                element={
                  <CrudPage
                    title="Leadership"
                    resource="leaders"
                    defaults={{ name: emptyBi(), title: emptyBi(), bio: emptyBi(), image: "", active: true }}
                    fields={[
                      { key: "name", type: "bi", label: "Name" },
                      { key: "title", type: "bi", label: "Role" },
                      { key: "bio", type: "bi", label: "Biography", rows: 5 },
                      { key: "image", type: "image", label: "Photo" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/governance"
                element={
                  <CrudPage
                    title="Corporate governance"
                    resource="governance"
                    defaults={{ title: emptyBi(), body: emptyBi(), active: true }}
                    fields={[
                      { key: "title", type: "bi", label: "Title" },
                      { key: "body", type: "bi", label: "Body", rows: 6 },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route
                path="/subsidiaries"
                element={
                  <CrudPage
                    title="Subsidiaries"
                    resource="subsidiaries"
                    defaults={{
                      name: emptyBi(),
                      tagline: emptyBi(),
                      description: emptyBi(),
                      websiteUrl: "https://",
                      logo: "",
                      image: "",
                      active: true,
                    }}
                    fields={[
                      { key: "name", type: "bi", label: "Name" },
                      { key: "tagline", type: "bi", label: "Tagline" },
                      { key: "description", type: "bi", label: "Description", rows: 5 },
                      { key: "websiteUrl", type: "text", label: "Website URL" },
                      { key: "logo", type: "image", label: "Logo" },
                      { key: "image", type: "image", label: "Cover image" },
                      { key: "active", type: "bool", label: "Visible on website" },
                    ]}
                  />
                }
              />
              <Route path="/seo" element={<SeoPage />} />
              <Route path="/media" element={<MediaPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/account" element={<AccountPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
