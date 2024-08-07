import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SSOLogger } from './infrastructure/logger/logger';
import { middleware } from './app.middleware';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerInterceptor } from './common/logger/http-logger';
import { HttpExceptionFilter } from './common/exception/exception-filter';
import { TypedConfigService } from './config/typed-config.service';

async function bootstrap() {
    const logger = new SSOLogger();
    const app = await NestFactory.create(AppModule);
    const configService = app.get(TypedConfigService);
    const PORT = configService.get('apiPort') || 3000;

    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: configService.get('baseUri'),
            port: configService.get('microservicePort'),
        },
    });

    app.enableCors({
        origin: `${configService.get('frontUri')}:${configService.get('frontPort')}`,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    middleware(app);
    app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)));
    app.useGlobalInterceptors(new LoggerInterceptor());

    const config = new DocumentBuilder().setTitle('SSO').setDescription('The auth service').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.startAllMicroservices();

    await app.listen(PORT);

    logger.verbose(`start on port: ${PORT}`);
    logger.verbose(
        `microservice port start: ${JSON.stringify({
            host: configService.get('baseUri'),
            port: configService.get('microservicePort'),
        })}`,
    );
}

bootstrap();
