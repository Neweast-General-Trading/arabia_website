import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { existsSync, statSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();
const t = (en: string, ar: string) => ({ en, ar });

function media(filename: string, altEn: string, altAr: string) {
  const filePath = join(process.cwd(), 'uploads', filename);
  const size = existsSync(filePath) ? statSync(filePath).size : 0;
  const ext = filename.split('.').pop()?.toLowerCase();
  const mime =
    ext === 'png'
      ? 'image/png'
      : ext === 'webp'
        ? 'image/webp'
        : ext === 'svg'
          ? 'image/svg+xml'
          : 'image/jpeg';
  return {
    filename,
    original: filename,
    mimeType: mime,
    size,
    url: `/uploads/${filename}`,
    alt: t(altEn, altAr),
  };
}

async function main() {
  await prisma.contactMessage.deleteMany();
  await prisma.pageSeo.deleteMany();
  await prisma.valueItem.deleteMany();
  await prisma.governanceItem.deleteMany();
  await prisma.storyMilestone.deleteMany();
  await prisma.subsidiary.deleteMany();
  await prisma.leader.deleteMany();
  await prisma.pillar.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.media.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.user.deleteMany();

  const email = process.env.ADMIN_EMAIL || 'admin@neweast.sa';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

  await prisma.user.create({
    data: {
      email,
      password: await bcrypt.hash(password, 10),
      name: 'Site Administrator',
      role: 'admin',
    },
  });

  const files = [
    media('logo-holding.svg', 'Neweast Arabia logo', 'شعار نيويست أرابيا'),
    media('logo-holding-white.svg', 'Neweast Arabia white logo', 'شعار نيويست أرابيا الأبيض'),
    media('logo-neweast-red.png', 'Neweast logo', 'شعار نيويست'),
    media('logo-neweast-white.png', 'Neweast white logo', 'شعار نيويست الأبيض'),
    media('logo-isuzu-word.svg', 'ISUZU logo', 'شعار إيسوزو'),
    media('logo-isuzu-red.png', 'ISUZU red logo', 'شعار إيسوزو الأحمر'),
    media('logo-nextar-mark.png', 'NEXTAR logo', 'شعار نكستار'),
    media('logo-isuzu-alt.png', 'Isuzu logo', 'شعار إيسوزو'),
    media('logo-nextar.png', 'Neweast NEXTAR logo', 'شعار نيويست نكستار'),
    media('logo-nextar-white.png', 'NEXTAR white logo', 'شعار نكستار الأبيض'),
    media('hero-parts-1.jpg', 'Premium automotive parts', 'قطع غيار سيارات فاخرة'),
    media('hero-parts-2.jpg', 'High performance batteries', 'بطاريات عالية الأداء'),
    media('hero-parts-3.jpg', 'Premium lubricants', 'زيوت تشحيم متميزة'),
    media('cat-vehicles.jpg', 'Automotive vehicles', 'المركبات'),
    media('cat-bearing.jpg', 'Bearings', 'رولمان بلي'),
    media('cat-brakes.jpg', 'Brake parts', 'قطع الفرامل'),
    media('cat-filters.jpg', 'Filters', 'فلاتر'),
    media('cat-lubricants.jpg', 'Lubricants and chemicals', 'زيوت وكيماويات'),
    media('cat-suspension.jpg', 'Suspension parts', 'قطع التعليق'),
    media('showroom-riyadh.png', 'Neweast showroom in Riyadh', 'معرض نيويست في الرياض'),
    media('booth.png', 'Neweast exhibition booth', 'جناح نيويست في المعارض'),
    media('isuzu-trucks.webp', 'ISUZU trucks', 'شاحنات إيسوزو'),
    media('isuzu-vehicles.webp', 'ISUZU vehicles', 'مركبات إيسوزو'),
    media('isuzu-buses.webp', 'ISUZU buses', 'حافلات إيسوزو'),
    media('isuzu-photo.png', 'ISUZU operations in Saudi Arabia', 'عمليات إيسوزو في السعودية'),
    media('isuzu-photo-2.png', 'ISUZU aftersales', 'خدمات ما بعد البيع لإيسوزو'),
    media('isuzu-bg.jpg', 'ISUZU highway', 'طرق المملكة'),
    media('isuzu-other.webp', 'ISUZU commercial vehicles', 'المركبات التجارية لإيسوزو'),
    media('nextar-x7.jpg', 'NEXTAR X7 truck', 'شاحنة نكستار X7'),
    media('nextar-x9.jpg', 'NEXTAR X9 truck', 'شاحنة نكستار X9'),
    media('nextar-service.jpg', 'NEXTAR service center', 'مركز صيانة نكستار'),
    media('nextar-parts.jpg', 'NEXTAR spare parts', 'قطع غيار نكستار'),
    media('nextar-maintenance.jpg', 'NEXTAR maintenance', 'صيانة نكستار'),
  ];

  await prisma.media.createMany({ data: files });

  await prisma.setting.create({
    data: {
      id: 'main',
      data: {
        companyName: t('Neweast Arabia Holding', 'نيويست أرابيا القابضة'),
        tagline: t(
          'A holding company building automotive excellence across Saudi Arabia.',
          'شركة قابضة تبني التميز في قطاع السيارات عبر المملكة العربية السعودية.',
        ),
        logoLight: '/uploads/logo-neweast-red.png',
        logoDark: '/uploads/logo-neweast-white.png',
        favicon: '/uploads/logo-neweast-red.png',
        primaryColor: '#E30613',
        secondaryColor: '#0B1220',
        accentColor: '#009FE3',
        email: 'info@neweast.sa',
        phone: '+966 11 516 2780',
        whatsapp: '+966115162780',
        address: t(
          'Al Faisaliyah, Riyadh, Kingdom of Saudi Arabia',
          'الفيصلية، الرياض، المملكة العربية السعودية',
        ),
        mapEmbedUrl:
          'https://maps.google.com/maps?q=Al%20Faisaliyah%20Riyadh&t=&z=13&ie=UTF8&iwloc=&output=embed',
        linkedin: 'https://www.linkedin.com/company/neweastgroup',
        twitter: '',
        instagram: '',
        youtube: '',
        siteUrl: 'https://arabia.neweast.cloud',
        seoTitle: t(
          'Neweast Arabia Holding | Saudi Arabia',
          'نيويست أرابيا القابضة | المملكة العربية السعودية',
        ),
        seoDescription: t(
          'Neweast Arabia is the holding company for Neweast Spare Parts, Neweast Isuzu and Neweast NEXTAR, showcasing our business presence across Saudi Arabia.',
          'نيويست أرابيا هي الشركة القابضة لنيويست لقطع الغيار ونيويست إيسوزو ونيويست نكستار، وتعرض حضورنا التجاري في أنحاء المملكة.',
        ),
        seoKeywords: t(
          'Neweast, Saudi Arabia, holding company, Isuzu, NEXTAR, spare parts, Riyadh',
          'نيويست, السعودية, شركة قابضة, إيسوزو, نكستار, قطع غيار, الرياض',
        ),
        ogImage: '/uploads/showroom-riyadh.png',
        analyticsId: '',
        whoWeAreEyebrow: t('Who We Are', 'من نحن'),
        whoWeAreTitle: t(
          'A trusted automotive group, now rooted in the Kingdom.',
          'مجموعة سيارات موثوقة، متجذرة اليوم في المملكة.',
        ),
        whoWeAreBody: t(
          'Since 1992, Neweast Group has grown from a regional trading firm into one of the most trusted names in automotive spare parts, vehicles and aftersales. Neweast Arabia represents our holding presence in Saudi Arabia — connecting our spare parts, Isuzu and NEXTAR businesses under one professional platform aligned with Vision 2030.',
          'منذ عام 1992، نمت مجموعة نيويست من شركة تجارية إقليمية إلى أحد أكثر الأسماء ثقة في قطع غيار السيارات والمركبات وخدمات ما بعد البيع. تمثل نيويست أرابيا حضورنا القابض في المملكة — وتربط أعمال قطع الغيار وإيسوزو ونكستار تحت منصة مهنية واحدة بما يتوافق مع رؤية 2030.',
        ),
        whoWeAreImage: '/uploads/showroom-riyadh.png',
        overviewTitle: t('Company Overview', 'نبذة عن الشركة'),
        overviewBody: t(
          'Neweast Arabia is the holding entity that presents our Saudi operations as a unified group. We provide a clear window onto our subsidiaries, leadership and governance, while each business continues to serve customers through its dedicated website.',
          'نيويست أرابيا هي الكيان القابض الذي يعرض عملياتنا في السعودية كمجموعة موحّدة. نقدّم نافذة واضحة على الشركات التابعة والقيادة والحوكمة، بينما تواصل كل شركة خدمة عملائها عبر موقعها الخاص.',
        ),
        overviewImage: '/uploads/booth.png',
        missionTitle: t('Our Mission', 'رسالتنا'),
        missionBody: t(
          'To build lasting partnerships and deliver reliable automotive solutions — spare parts, commercial vehicles and aftersales — that keep businesses across Saudi Arabia moving.',
          'بناء شراكات مستدامة وتقديم حلول سيارات موثوقة — قطع غيار ومركبات تجارية وخدمات ما بعد البيع — تُبقي الأعمال في أنحاء المملكة تتحرك.',
        ),
        visionTitle: t('Our Vision', 'رؤيتنا'),
        visionBody: t(
          'To be the most trusted automotive holding in the Kingdom, recognized for reliability, responsible growth and contribution to Vision 2030.',
          'أن نكون الشركة القابضة الأكثر ثقة في قطاع السيارات بالمملكة، معروفين بالموثوقية والنمو المسؤول والمساهمة في رؤية 2030.',
        ),
        footerAbout: t(
          'Neweast Arabia Holding is the Saudi platform for our spare parts, Isuzu and NEXTAR businesses.',
          'نيويست أرابيا القابضة هي المنصة السعودية لأعمال قطع الغيار وإيسوزو ونكستار.',
        ),
        copyright: t(
          '© Neweast Arabia Holding. All rights reserved.',
          '© نيويست أرابيا القابضة. جميع الحقوق محفوظة.',
        ),
        stats: [
          { value: '1992', label: t('Founded', 'سنة التأسيس') },
          { value: '3', label: t('Core businesses', 'أعمال رئيسية') },
          { value: 'KSA', label: t('Kingdom presence', 'حضور في المملكة') },
          { value: '30+', label: t('Years of expertise', 'عاماً من الخبرة') },
        ],
      },
    },
  });

  await prisma.banner.createMany({
    data: [
      {
        image: '/uploads/showroom-riyadh.png',
        title: t('Automotive excellence, rooted in Saudi Arabia', 'تميز في قطاع السيارات، متجذر في المملكة'),
        subtitle: t(
          'Neweast Arabia Holding is the platform for our spare parts, Isuzu and NEXTAR businesses across the Kingdom.',
          'نيويست أرابيا القابضة هي منصة أعمال قطع الغيار وإيسوزو ونكستار في أنحاء المملكة.',
        ),
        ctaLabel: t('Explore our businesses', 'استكشف أعمالنا'),
        ctaLink: '/subsidiaries',
        sortOrder: 0,
      },
      {
        image: '/uploads/hero-parts-1.jpg',
        title: t('Powering businesses with premium automotive parts', 'نقود الأعمال بقطع غيار سيارات متميزة'),
        subtitle: t(
          'Neweast Spare Parts delivers trusted components, lubricants and logistics to workshops, fleets and traders.',
          'تقدم نيويست لقطع الغيار مكونات وزيوتاً وخدمات لوجستية موثوقة لورش العمل والأسطول والتجار.',
        ),
        ctaLabel: t('Visit Neweast', 'زيارة نيويست'),
        ctaLink: 'https://www.neweast.cloud/',
        sortOrder: 1,
      },
      {
        image: '/uploads/isuzu-trucks.webp',
        title: t('Robust mobility solutions. Built for Saudi conditions.', 'حلول تنقل قوية. مصممة لظروف المملكة.'),
        subtitle: t(
          'Neweast Isuzu brings trucks, buses, pickups and genuine aftersales to customers nationwide.',
          'تقدم نيويست إيسوزو الشاحنات والحافلات والبيك أب وخدمات ما بعد البيع الأصلية للعملاء في أنحاء المملكة.',
        ),
        ctaLabel: t('Visit Neweast Isuzu', 'زيارة نيويست إيسوزو'),
        ctaLink: 'http://isuzu.sa/',
        sortOrder: 2,
      },
      {
        image: '/uploads/nextar-x7.jpg',
        title: t('Built to keep business moving', 'صُممت لتُبقي الأعمال في حركة'),
        subtitle: t(
          'Neweast NEXTAR delivers durable commercial trucks, genuine parts and service you can trust.',
          'تقدم نيويست نكستار شاحنات تجارية متينة وقطعاً أصلية وخدمة يمكن الاعتماد عليها.',
        ),
        ctaLabel: t('Visit NEXTAR', 'زيارة نكستار'),
        ctaLink: 'https://nextar-me.com/en',
        sortOrder: 3,
      },
    ],
  });

  await prisma.pillar.createMany({
    data: [
      {
        icon: 'flag',
        image: '/uploads/isuzu-bg.jpg',
        title: t('Vision 2030 alignment', 'التوافق مع رؤية 2030'),
        body: t(
          'We invest in local capability, service coverage and sustainable mobility that supports the Kingdom’s long-term economic transformation.',
          'نستثمر في القدرات المحلية وتغطية الخدمات والتنقل المستدام بما يدعم التحول الاقتصادي طويل الأمد للمملكة.',
        ),
        sortOrder: 0,
      },
      {
        icon: 'layers',
        image: '/uploads/cat-vehicles.jpg',
        title: t('Integrated automotive group', 'مجموعة سيارات متكاملة'),
        body: t(
          'Spare parts, commercial vehicles and aftersales operate as complementary businesses under one holding, giving customers a wider circle of trust.',
          'تعمل قطع الغيار والمركبات التجارية وخدمات ما بعد البيع كأعمال متكاملة تحت مظلة قابضة واحدة، مما يمنح العملاء دائرة أوسع من الثقة.',
        ),
        sortOrder: 1,
      },
      {
        icon: 'handshake',
        image: '/uploads/nextar-service.jpg',
        title: t('Partnerships that last', 'شراكات تدوم'),
        body: t(
          'From global manufacturers to local workshops and fleets, we build relationships on reliability, integrity and on-time delivery.',
          'من المصنّعين العالميين إلى الورش والأسطول المحلي، نبني علاقات قائمة على الموثوقية والنزاهة والتسليم في الوقت المحدد.',
        ),
        sortOrder: 2,
      },
      {
        icon: 'trending-up',
        image: '/uploads/booth.png',
        title: t('Responsible growth', 'نمو مسؤول'),
        body: t(
          'We expand our Saudi footprint with disciplined governance, quality standards and a long-term view of people, partners and performance.',
          'نوسّع بصمتنا في السعودية بحوكمة منضبطة ومعايير جودة ونظرة طويلة الأمد للناس والشركاء والأداء.',
        ),
        sortOrder: 3,
      },
    ],
  });

  await prisma.valueItem.createMany({
    data: [
      {
        icon: 'shield',
        title: t('Integrity', 'النزاهة'),
        body: t(
          'We do what we say. Transparency and ethical conduct guide every partnership and every transaction.',
          'نفي بما نعد. الشفافية والسلوك الأخلاقي يوجهان كل شراكة وكل معاملة.',
        ),
        sortOrder: 0,
      },
      {
        icon: 'award',
        title: t('Reliability', 'الموثوقية'),
        body: t(
          'Customers depend on us to keep vehicles and operations running. We treat that responsibility as non-negotiable.',
          'يعتمد العملاء علينا لإبقاء المركبات والعمليات قيد التشغيل. نتعامل مع هذه المسؤولية بلا تهاون.',
        ),
        sortOrder: 1,
      },
      {
        icon: 'users',
        title: t('Customer focus', 'التركيز على العميل'),
        body: t(
          'Workshops, fleets, dealerships and drivers sit at the centre of how we design products, service and coverage.',
          'الورش والأسطول والوكلاء والسائقون في صميم تصميم منتجاتنا وخدماتنا وتغطيتنا.',
        ),
        sortOrder: 2,
      },
      {
        icon: 'sparkles',
        title: t('Innovation', 'الابتكار'),
        body: t(
          'We continuously improve our portfolio, logistics and aftersales so partners stay ahead of a changing market.',
          'نطوّر باستمرار محفظتنا واللوجستيات وخدمات ما بعد البيع ليبقى شركاؤنا في مقدمة سوق متغير.',
        ),
        sortOrder: 3,
      },
    ],
  });

  await prisma.leader.createMany({
    data: [
      {
        image: '',
        name: t('Ahmed Al-Rashid', 'أحمد الراشد'),
        title: t('Chairman', 'رئيس مجلس الإدارة'),
        bio: t(
          'Provides board direction for Neweast Arabia Holding, with a long-term view of the group’s presence in the Kingdom.',
          'يقدّم توجيه مجلس الإدارة لنيويست أرابيا القابضة، بنظرة طويلة الأمد لحضور المجموعة في المملكة.',
        ),
        sortOrder: 0,
      },
      {
        image: '',
        name: t('Sara Al-Mutairi', 'سارة المطيري'),
        title: t('Chief Executive Officer', 'الرئيس التنفيذي'),
        bio: t(
          'Leads the holding’s day-to-day strategy, connecting spare parts, Isuzu and NEXTAR under one Saudi platform.',
          'يقود استراتيجية الشركة القابضة يوماً بيوم، ويربط قطع الغيار وإيسوزو ونكستار تحت منصة سعودية واحدة.',
        ),
        sortOrder: 1,
      },
      {
        image: '',
        name: t('Omar Haddad', 'عمر حداد'),
        title: t('Managing Director, Automotive', 'المدير العام للسيارات'),
        bio: t(
          'Oversees automotive operations across the group, with a focus on vehicles, aftersales and customer coverage.',
          'يشرف على عمليات السيارات عبر المجموعة، مع التركيز على المركبات وخدمات ما بعد البيع وتغطية العملاء.',
        ),
        sortOrder: 2,
      },
      {
        image: '',
        name: t('Layla Khan', 'ليلى خان'),
        title: t('Chief Financial Officer', 'المدير المالي'),
        bio: t(
          'Stewards financial discipline and reporting for the holding, supporting responsible growth in Saudi Arabia.',
          'يرعى الانضباط المالي والتقارير للشركة القابضة، بما يدعم نمواً مسؤولاً في المملكة.',
        ),
        sortOrder: 3,
      },
    ],
  });

  await prisma.subsidiary.createMany({
    data: [
      {
        logo: '/uploads/logo-neweast-red.png',
        image: '/uploads/hero-parts-1.jpg',
        name: t('Neweast Spare Parts', 'نيويست لقطع الغيار'),
        tagline: t('Premium auto parts & global logistics', 'قطع غيار فاخرة ولوجستيات عالمية'),
        description: t(
          'A pioneering force in automotive spare parts since 1992. Neweast supplies workshops, fleets, dealerships and traders with components, lubricants, batteries and logistics across the MENA region.',
          'قوة رائدة في قطع غيار السيارات منذ 1992. تزوّد نيويست الورش والأسطول والوكلاء والتجار بالمكونات والزيوت والبطاريات واللوجستيات عبر منطقة الشرق الأوسط وشمال أفريقيا.',
        ),
        websiteUrl: 'https://www.neweast.cloud/',
        sortOrder: 0,
      },
      {
        logo: '/uploads/logo-isuzu-red.png',
        image: '/uploads/isuzu-trucks.webp',
        name: t('Neweast Isuzu', 'نيويست إيسوزو'),
        tagline: t('Official ISUZU presence in Saudi Arabia', 'الحضور الرسمي لإيسوزو في السعودية'),
        description: t(
          'Neweast Isuzu delivers trucks, buses, pickups and genuine parts with showrooms and service in Jeddah, Riyadh and beyond — engineered for Saudi conditions.',
          'تقدم نيويست إيسوزو الشاحنات والحافلات والبيك أب والقطع الأصلية مع معارض وخدمة في جدة والرياض وغيرها — مصممة لظروف المملكة.',
        ),
        websiteUrl: 'http://isuzu.sa/',
        sortOrder: 1,
      },
      {
        logo: '/uploads/logo-nextar-mark.png',
        image: '/uploads/nextar-x9.jpg',
        name: t('Neweast NEXTAR', 'نيويست نكستار'),
        tagline: t('Commercial trucks, parts and service', 'شاحنات تجارية وقطع غيار وخدمة'),
        description: t(
          'NEXTAR keeps business moving with durable commercial trucks such as the X7 and X9, plus genuine spare parts, maintenance and repair services in Riyadh.',
          'تُبقي نكستار الأعمال في حركة عبر شاحنات تجارية متينة مثل X7 و X9، إضافة إلى القطع الأصلية وخدمات الصيانة والإصلاح في الرياض.',
        ),
        websiteUrl: 'https://nextar-me.com/en',
        sortOrder: 2,
      },
    ],
  });

  await prisma.storyMilestone.createMany({
    data: [
      {
        year: '1992',
        image: '/uploads/booth.png',
        title: t('The beginning', 'البداية'),
        body: t(
          'Neweast is established and begins its journey as a trusted automotive trading firm, laying the foundations of integrity and customer commitment.',
          'تأسست نيويست وبدأت رحلتها كشركة تجارية موثوقة في قطاع السيارات، واضعة أسس النزاهة والالتزام تجاه العملاء.',
        ),
        sortOrder: 0,
      },
      {
        year: '2000s',
        image: '/uploads/hero-parts-1.jpg',
        title: t('Regional expansion', 'التوسع الإقليمي'),
        body: t(
          'The group scales distribution of spare parts, lubricants and components, becoming a preferred partner for workshops and fleets across the region. Lorem ipsum dolor sit amet.',
          'وسّعت المجموعة توزيع قطع الغيار والزيوت والمكونات لتصبح شريكاً مفضلاً للورش والأسطول في المنطقة. نص تجريبي قابل للتعديل.',
        ),
        sortOrder: 1,
      },
      {
        year: '2024',
        image: '/uploads/isuzu-trucks.webp',
        title: t('Isuzu partnership in KSA', 'شراكة إيسوزو في السعودية'),
        body: t(
          'Neweast and Isuzu launch a landmark dealership in the Kingdom, opening a new chapter in commercial vehicles, aftersales and nationwide support.',
          'أطلقت نيويست وإيسوزو وكالة بارزة في المملكة، فاتحة فصلاً جديداً في المركبات التجارية وخدمات ما بعد البيع والدعم على مستوى البلاد.',
        ),
        sortOrder: 2,
      },
      {
        year: '2025',
        image: '/uploads/showroom-riyadh.png',
        title: t('Riyadh showroom & NEXTAR', 'معرض الرياض ونكستار'),
        body: t(
          'A new showroom in Riyadh strengthens our Saudi footprint, while NEXTAR expands commercial truck, parts and service offerings for business customers.',
          'يعزز معرض جديد في الرياض بصمتنا السعودية، بينما توسّع نكستار عروض الشاحنات التجارية والقطع والخدمة لعملاء الأعمال.',
        ),
        sortOrder: 3,
      },
      {
        year: 'Today',
        image: '/uploads/nextar-x9.jpg',
        title: t('Neweast Arabia holding', 'نيويست أرابيا القابضة'),
        body: t(
          'This platform presents the group as a holding company in Saudi Arabia — one story, three businesses, and a clear path for future subsidiaries.',
          'تعرض هذه المنصة المجموعة كشركة قابضة في السعودية — قصة واحدة، وثلاثة أعمال، ومسار واضح للشركات التابعة مستقبلاً.',
        ),
        sortOrder: 4,
      },
    ],
  });

  await prisma.governanceItem.createMany({
    data: [
      {
        title: t('Board oversight', 'إشراف مجلس الإدارة'),
        body: t(
          'The board provides strategic direction, risk oversight and accountability across the holding and its subsidiaries.',
          'يشرف مجلس الإدارة على التوجه الاستراتيجي وإدارة المخاطر والمساءلة عبر الشركة القابضة وشركاتها التابعة.',
        ),
        sortOrder: 0,
      },
      {
        title: t('Ethics & compliance', 'الأخلاقيات والامتثال'),
        body: t(
          'We expect every business under Neweast Arabia to operate with integrity, fair dealing and respect for applicable laws and regulations in the Kingdom.',
          'نتوقع من كل عمل تحت نيويست أرابيا أن يعمل بنزاهة وتعامل عادل واحترام للأنظمة واللوائح المعمول بها في المملكة.',
        ),
        sortOrder: 1,
      },
      {
        title: t('Transparency with stakeholders', 'الشفافية مع أصحاب المصلحة'),
        body: t(
          'Customers, partners and employees deserve clarity. This website exists to present who we are, how we are organised, and how to reach each business.',
          'يستحق العملاء والشركاء والموظفون الوضوح. يوجد هذا الموقع لعرض من نحن وكيف نُنظَّم وكيف يمكن الوصول إلى كل عمل.',
        ),
        sortOrder: 2,
      },
      {
        title: t('Future subsidiaries', 'الشركات التابعة مستقبلاً'),
        body: t(
          'The holding structure is designed to welcome additional businesses. New entities can be added from the dashboard with name, story, imagery and website link.',
          'صُممت الهيكلة القابضة لاستقبال أعمال إضافية. يمكن إضافة كيانات جديدة من لوحة التحكم مع الاسم والقصة والصور ورابط الموقع.',
        ),
        sortOrder: 3,
      },
    ],
  });

  const pages = [
    {
      slug: 'home',
      title: t('Neweast Arabia Holding | Home', 'نيويست أرابيا القابضة | الرئيسية'),
      description: t(
        'Discover Neweast Arabia Holding, the group behind Neweast Spare Parts, Neweast Isuzu and Neweast NEXTAR in Saudi Arabia.',
        'تعرّف على نيويست أرابيا القابضة، المجموعة وراء نيويست لقطع الغيار ونيويست إيسوزو ونيويست نكستار في السعودية.',
      ),
      ogImage: '/uploads/showroom-riyadh.png',
    },
    {
      slug: 'about',
      title: t('Company Overview | Neweast Arabia Holding', 'نبذة عن الشركة | نيويست أرابيا القابضة'),
      description: t(
        'An overview of Neweast Arabia, our holding presence in Saudi Arabia and the businesses we represent.',
        'نبذة عن نيويست أرابيا وحضورنا القابض في السعودية والأعمال التي نمثلها.',
      ),
      ogImage: '/uploads/booth.png',
    },
    {
      slug: 'story',
      title: t('Our Story | Neweast Arabia Holding', 'قصتنا | نيويست أرابيا القابضة'),
      description: t(
        'From 1992 to our Saudi holding platform today — the story of Neweast in the Kingdom.',
        'من 1992 إلى منصتنا القابضة في السعودية اليوم — قصة نيويست في المملكة.',
      ),
      ogImage: '/uploads/showroom-riyadh.png',
    },
    {
      slug: 'mission',
      title: t('Mission, Vision & Values | Neweast Arabia Holding', 'الرسالة والرؤية والقيم | نيويست أرابيا القابضة'),
      description: t(
        'The mission, vision and values that guide Neweast Arabia and our subsidiaries.',
        'الرسالة والرؤية والقيم التي توجه نيويست أرابيا وشركاتها التابعة.',
      ),
      ogImage: '/uploads/isuzu-bg.jpg',
    },
    {
      slug: 'leadership',
      title: t('Our Leadership | Neweast Arabia Holding', 'قيادتنا | نيويست أرابيا القابضة'),
      description: t(
        'Meet the leadership team of Neweast Arabia. Profiles are placeholders and fully editable.',
        'تعرّف على فريق قيادة نيويست أرابيا. الملفات تجريبية وقابلة للتعديل بالكامل.',
      ),
      ogImage: '/uploads/booth.png',
    },
    {
      slug: 'governance',
      title: t('Corporate Governance | Neweast Arabia Holding', 'الحوكمة المؤسسية | نيويست أرابيا القابضة'),
      description: t(
        'How Neweast Arabia approaches board oversight, ethics, compliance and stakeholder transparency.',
        'كيف تتعامل نيويست أرابيا مع إشراف المجلس والأخلاقيات والامتثال وشفافية أصحاب المصلحة.',
      ),
      ogImage: '/uploads/cat-vehicles.jpg',
    },
    {
      slug: 'subsidiaries',
      title: t('Our Businesses | Neweast Arabia Holding', 'أعمالنا | نيويست أرابيا القابضة'),
      description: t(
        'Visit Neweast Spare Parts, Neweast Isuzu and Neweast NEXTAR — the businesses of Neweast Arabia Holding.',
        'زُر نيويست لقطع الغيار ونيويست إيسوزو ونيويست نكستار — أعمال نيويست أرابيا القابضة.',
      ),
      ogImage: '/uploads/hero-parts-1.jpg',
    },
    {
      slug: 'contact',
      title: t('Contact Us | Neweast Arabia Holding', 'اتصل بنا | نيويست أرابيا القابضة'),
      description: t(
        'Contact Neweast Arabia Holding in Riyadh. Reach our office or any of our businesses.',
        'تواصل مع نيويست أرابيا القابضة في الرياض. يمكنك الوصول إلى مكتبنا أو أي من شركاتنا.',
      ),
      ogImage: '/uploads/showroom-riyadh.png',
    },
  ];

  for (const page of pages) {
    await prisma.pageSeo.create({
      data: {
        ...page,
        keywords: t(
          'Neweast Arabia Holding, holding, Saudi Arabia, automotive',
          'نيويست أرابيا القابضة, قابضة, السعودية, سيارات',
        ),
      },
    });
  }

  console.log('Seed complete.');
  console.log(`Admin login: ${email} / ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
