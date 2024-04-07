import type { INestApplication } from '@nestjs/common';
import * as compression from 'compression';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
// import * as csurf from 'csurf';

export function middleware(app: INestApplication): INestApplication {
    const isProduction = process.env.NODE_ENV === 'production';
    // app.use(
    //     session({
    //         // Requires 'store' setup for production
    //         secret: 'tEsTeD',
    //         resave: false,
    //         saveUninitialized: true,
    //         cookie: { secure: isProduction },
    //     }),
    // );

    app.use(compression());
    // Добавляем middleware для защиты от CSRF
    // app.use(
    //     csurf({
    //         cookie: {
    //             httpOnly: true,
    //             secure: isProduction, // только для HTTPS
    //             sameSite: 'strict',
    //         },
    //     }),
    // );
    app.use(passport.initialize());
    // app.use(passport.session());
    app.use(
        helmet({
            contentSecurityPolicy: isProduction ? undefined : false,
            crossOriginEmbedderPolicy: isProduction ? undefined : false,
        }),
    );
    return app;
}
