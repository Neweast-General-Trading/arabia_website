import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email?.toLowerCase().trim() },
    });
    if (!user || !(await bcrypt.compare(body.password || '', user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { sub: string } }) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  @UseGuards(JwtAuthGuard)
  @Post('password')
  async changePassword(
    @Req() req: { user: { sub: string } },
    @Body() body: { currentPassword: string; newPassword: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    if (!user || !(await bcrypt.compare(body.currentPassword || '', user.password))) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    if (!body.newPassword || body.newPassword.length < 8) {
      throw new UnauthorizedException('New password must be at least 8 characters');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(body.newPassword, 10) },
    });
    return { ok: true };
  }
}
