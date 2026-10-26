import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const uploadDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadDir)) mkdirSync(uploadDir, { recursive: true });

@Controller('api/admin/media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  list() {
    return this.prisma.media.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (_req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 12 * 1024 * 1024 },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: { altEn?: string; altAr?: string }) {
    if (!file) throw new BadRequestException('File is required');
    return this.prisma.media.create({
      data: {
        filename: file.filename,
        original: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`,
        alt: { en: body.altEn || file.originalname, ar: body.altAr || file.originalname },
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { alt?: { en?: string; ar?: string } },
  ) {
    return this.prisma.media.update({ where: { id }, data: { alt: body.alt } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const item = await this.prisma.media.findUnique({ where: { id } });
    if (item) {
      const filePath = join(uploadDir, item.filename);
      if (existsSync(filePath)) unlinkSync(filePath);
      await this.prisma.media.delete({ where: { id } });
    }
    return { ok: true };
  }
}
