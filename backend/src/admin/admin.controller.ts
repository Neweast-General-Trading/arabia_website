import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const MODELS = {
  banners: 'banner',
  pillars: 'pillar',
  leaders: 'leader',
  subsidiaries: 'subsidiary',
  story: 'storyMilestone',
  governance: 'governanceItem',
  values: 'valueItem',
} as const;

type Resource = keyof typeof MODELS;

function isResource(value: string): value is Resource {
  return value in MODELS;
}

@Controller('api/admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('settings')
  async getSettings() {
    const row = await this.prisma.setting.findUnique({ where: { id: 'main' } });
    return row?.data ?? {};
  }

  @Put('settings')
  async saveSettings(@Body() data: Prisma.InputJsonValue) {
    const row = await this.prisma.setting.upsert({
      where: { id: 'main' },
      update: { data },
      create: { id: 'main', data },
    });
    return row.data;
  }

  @Get('messages')
  messages() {
    return this.prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Patch('messages/:id/read')
  markRead(@Param('id') id: string, @Body() body: { read?: boolean }) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read: body.read ?? true },
    });
  }

  @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string) {
    await this.prisma.contactMessage.delete({ where: { id } });
    return { ok: true };
  }

  @Get('pages')
  pages() {
    return this.prisma.pageSeo.findMany();
  }

  @Put('pages/:slug')
  upsertPage(
    @Param('slug') slug: string,
    @Body()
    body: {
      title: Prisma.InputJsonValue;
      description: Prisma.InputJsonValue;
      keywords?: Prisma.InputJsonValue;
      ogImage?: string | null;
    },
  ) {
    return this.prisma.pageSeo.upsert({
      where: { slug },
      update: body,
      create: { slug, ...body },
    });
  }

  @Get('stats')
  async stats() {
    const [messages, unread, media, banners, subsidiaries] = await Promise.all([
      this.prisma.contactMessage.count(),
      this.prisma.contactMessage.count({ where: { read: false } }),
      this.prisma.media.count(),
      this.prisma.banner.count(),
      this.prisma.subsidiary.count(),
    ]);
    return { messages, unread, media, banners, subsidiaries };
  }

  @Get('content/:resource')
  list(@Param('resource') resource: string) {
    const model = this.model(resource);
    return model.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  @Post('content/:resource')
  create(@Param('resource') resource: string, @Body() body: Record<string, unknown>) {
    const model = this.model(resource);
    return model.create({ data: body });
  }

  @Put('content/:resource/:id')
  update(
    @Param('resource') resource: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    const model = this.model(resource);
    return model.update({ where: { id }, data: body });
  }

  @Delete('content/:resource/:id')
  async remove(@Param('resource') resource: string, @Param('id') id: string) {
    const model = this.model(resource);
    await model.delete({ where: { id } });
    return { ok: true };
  }

  @Patch('content/:resource/reorder')
  async reorder(
    @Param('resource') resource: string,
    @Body() body: { ids: string[] },
  ) {
    const model = this.model(resource);
    if (!Array.isArray(body.ids)) throw new BadRequestException('ids required');
    await this.prisma.$transaction(
      body.ids.map((id, index) => model.update({ where: { id }, data: { sortOrder: index } })),
    );
    return { ok: true };
  }

  private model(resource: string) {
    if (!isResource(resource)) {
      throw new BadRequestException(`Unknown resource: ${resource}`);
    }
    return this.prisma[MODELS[resource]] as any;
  }
}
