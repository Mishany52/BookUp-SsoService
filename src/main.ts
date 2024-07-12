import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SSOLogger } from './infrastructure/logger/logger';
import { middleware } from './app.middleware';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, TcpOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
    const logger = new SSOLogger();
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    const configService = app.get(ConfigService);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.TCP,
        options: {
            host: configService.get('baseUri'),
            port: configService.get('microservicePort'),
        },
    }) as TcpOptions;

    // Настройка CORS
    app.enableCors({
        origin: `${configService.get('frontUri')}:${configService.get('frontPort')}`, // разрешить запросы с этого источника
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true, // если вы работаете с куки или авторизацией
    });

    const config = new DocumentBuilder()
        .setTitle('Parts Lib')
        .setDescription('The Parts library')
        // .setVersion('1.0')
        .addTag('Parts')
        .build();

    middleware(app);

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    const PORT = configService.get('apiPort') || 3000;
    await app.startAllMicroservices();
    await app.listen(PORT);
    logger.verbose(`Parts service start on port: ${PORT}`);
}

bootstrap();
