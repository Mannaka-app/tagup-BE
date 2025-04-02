import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 필드 제거
      forbidNonWhitelisted: true, // 정의되지 않은 필드가 있으면 에러
      transform: true, // class-transformer 적용
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TagUp API')
    .setDescription('태그업 API 명세서입니다')
    .setVersion('1.0')
    .addBearerAuth() // 🔐 JWT 인증 헤더 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
