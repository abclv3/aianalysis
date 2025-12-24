import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS 설정 - 프론트엔드에서 API 호출 허용
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    });

    // Global Validation Pipe - DTO 자동 검증
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
            forbidNonWhitelisted: true, // 정의되지 않은 속성 있으면 에러
            transform: true, // 자동 타입 변환
        }),
    );

    // Global Exception Filter - 일관된 에러 응답
    app.useGlobalFilters(new HttpExceptionFilter());

    // API prefix 설정
    app.setGlobalPrefix('api');

    const port = process.env.PORT || 3001;
    await app.listen(port);

    console.log(`🚀 Server is running on: http://localhost:${port}/api`);
}

bootstrap();
