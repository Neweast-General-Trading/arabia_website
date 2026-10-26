import { Body, Controller, Get, Header, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const LOCALES = ['en', 'ar'] as const;
type Locale = (typeof LOCALES)[number];

function pick(value: unknown, locale: Locale): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const rec = value as Record<string, string>;
    return rec[locale] || rec.en || rec.ar || '';
  }
  return String(value);
}

function localize<T extends Record<string, any>>(item: T, locale: Locale, fields: string[]) {
  const next: Record<string, any> = { ...item };
  for (const field of fields) {
    next[field] = pick(item[field], locale);
  }
  return next;
}

@Controller()
export class PublicController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('api/public/site')
  async site(@Query('locale') localeQuery?: string) {
    const locale: Locale = localeQuery === 'ar' ? 'ar' : 'en';
    const [settingsRow, banners, pillars, leaders, subsidiaries, story, governance, values, pages] =
      await Promise.all([
        this.prisma.setting.findUnique({ where: { id: 'main' } }),
        this.prisma.banner.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.pillar.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.leader.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.subsidiary.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.storyMilestone.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.governanceItem.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.valueItem.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
        this.prisma.pageSeo.findMany(),
      ]);

    const settings = (settingsRow?.data as Record<string, any>) || {};
    const localizedSettings = localizeSettings(settings, locale);

    const pagesMap: Record<string, any> = {};
    for (const page of pages) {
      pagesMap[page.slug] = {
        slug: page.slug,
        title: pick(page.title, locale),
        description: pick(page.description, locale),
        keywords: pick(page.keywords, locale),
        ogImage: page.ogImage,
      };
    }

    return {
      locale,
      settings: localizedSettings,
      banners: banners.map((b) => localize(b, locale, ['title', 'subtitle', 'ctaLabel'])),
      pillars: pillars.map((p) => localize(p, locale, ['title', 'body'])),
      leaders: leaders.map((l) => localize(l, locale, ['name', 'title', 'bio'])),
      subsidiaries: subsidiaries.map((s) => localize(s, locale, ['name', 'tagline', 'description'])),
      story: story.map((s) => localize(s, locale, ['title', 'body'])),
      governance: governance.map((g) => localize(g, locale, ['title', 'body'])),
      values: values.map((v) => localize(v, locale, ['title', 'body'])),
      pages: pagesMap,
    };
  }

  @Post('api/public/contact')
  async contact(
    @Body()
    body: {
      name: string;
      email: string;
      phone?: string;
      subject?: string;
      message: string;
      locale?: string;
    },
  ) {
    if (!body?.name || !body?.email || !body?.message) {
      return { ok: false, error: 'Name, email and message are required' };
    }
    await this.prisma.contactMessage.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        subject: body.subject?.trim() || null,
        message: body.message.trim(),
        locale: body.locale || 'en',
      },
    });
    return { ok: true };
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap() {
    const settings = (await this.prisma.setting.findUnique({ where: { id: 'main' } }))
      ?.data as Record<string, any> | undefined;
    const siteUrl = (settings?.siteUrl as string) || process.env.WEBSITE_URL || 'http://localhost:3020';
    const paths = [
      '',
      '/about',
      '/about/story',
      '/about/mission',
      '/about/leadership',
      '/governance',
      '/subsidiaries',
      '/contact',
    ];
    const lastmod = new Date().toISOString().slice(0, 10);
    const urls = LOCALES.flatMap((locale) =>
      paths.map((path) => {
        const loc = `${siteUrl.replace(/\/$/, '')}/${locale}${path}`;
        const altEn = `${siteUrl.replace(/\/$/, '')}/en${path}`;
        const altAr = `${siteUrl.replace(/\/$/, '')}/ar${path}`;
        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${altEn}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${altAr}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${altEn}" />
  </url>`;
      }),
    );
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;
  }

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  async robots() {
    const settings = (await this.prisma.setting.findUnique({ where: { id: 'main' } }))
      ?.data as Record<string, any> | undefined;
    const siteUrl = (settings?.siteUrl as string) || process.env.WEBSITE_URL || 'http://localhost:3020';
    const apiUrl = process.env.PUBLIC_URL || 'http://localhost:4000';
    return `User-agent: *
Allow: /

Sitemap: ${apiUrl}/sitemap.xml
Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml
`;
  }
}

function localizeSettings(settings: Record<string, any>, locale: Locale) {
  const bilingual = [
    'companyName',
    'tagline',
    'address',
    'footerAbout',
    'copyright',
    'whoWeAreEyebrow',
    'whoWeAreTitle',
    'whoWeAreBody',
    'overviewTitle',
    'overviewBody',
    'missionTitle',
    'missionBody',
    'visionTitle',
    'visionBody',
    'seoTitle',
    'seoDescription',
    'seoKeywords',
  ];
  const next: Record<string, any> = { ...settings };
  for (const key of bilingual) {
    if (key in settings) next[key] = pick(settings[key], locale);
  }
  if (Array.isArray(settings.stats)) {
    next.stats = settings.stats.map((s: any) => ({
      ...s,
      label: pick(s.label, locale),
    }));
  }
  return next;
}
