import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SSOLogger } from './infrastructure/logger/logger';
import { middleware } from './app.middleware';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const logger = new SSOLogger();
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const config = new DocumentBuilder()
        .setTitle('Parts Lib')
        .setDescription('The Parts library')
        // .setVersion('1.0')
        .addTag('Parts')
        .build();

    middleware(app);

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const PORT = process.env.API_PORT || 3000;
    await app.listen(PORT);
    logger.verbose(`Parts service start on port: ${PORT}`);
}

bootstrap();
