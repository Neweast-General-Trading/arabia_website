export type Locale = "en" | "ar";

export type Stat = { value: string; label: string };

export type Settings = {
  companyName: string;
  tagline: string;
  logoLight: string;
  logoDark: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  mapEmbedUrl: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  youtube: string;
  siteUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  analyticsId: string;
  whoWeAreEyebrow: string;
  whoWeAreTitle: string;
  whoWeAreBody: string;
  whoWeAreImage: string;
  overviewTitle: string;
  overviewBody: string;
  overviewImage: string;
  missionTitle: string;
  missionBody: string;
  visionTitle: string;
  visionBody: string;
  footerAbout: string;
  copyright: string;
  stats: Stat[];
};

export type Banner = {
  id: string;
  image: string | null;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string | null;
};

export type Pillar = {
  id: string;
  icon: string | null;
  image: string | null;
  title: string;
  body: string;
};

export type Leader = {
  id: string;
  image: string | null;
  name: string;
  title: string;
  bio: string;
};

export type Subsidiary = {
  id: string;
  logo: string | null;
  image: string | null;
  name: string;
  tagline: string;
  description: string;
  websiteUrl: string;
};

export type StoryMilestone = {
  id: string;
  year: string;
  image: string | null;
  title: string;
  body: string;
};

export type GovernanceItem = {
  id: string;
  title: string;
  body: string;
};

export type ValueItem = {
  id: string;
  icon: string | null;
  title: string;
  body: string;
};

export type PageSeo = {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string | null;
};

export type SiteData = {
  locale: Locale;
  settings: Settings;
  banners: Banner[];
  pillars: Pillar[];
  leaders: Leader[];
  subsidiaries: Subsidiary[];
  story: StoryMilestone[];
  governance: GovernanceItem[];
  values: ValueItem[];
  pages: Record<string, PageSeo>;
};
