import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: false, transform: true }));
  const port = Number(process.env.PORT) || 4000;
  await app.listen(port);
  console.log(`Neweast Arabia API running on http://localhost:${port}`);
}
bootstrap();
