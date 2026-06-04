import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // MATIKAN cors bawaan
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // serve file avatar agar bisa diakses via URL
  app.useStaticAssets(join(__dirname, '..', 'avatar'), { prefix: '/avatar' });

  await app.listen(3000);
}
bootstrap();
