export const config = {
    db: {
        entities: [`${__dirname}/../../entity/**/*.{js,ts}`],
    },
    jwtAccessSecrete: process.env.JWT_SECRET,
    jwtRefreshSecrete: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,

    apiName: process.env.API_NAME,
    apiPort: process.env.API_PORT,

    baseUri: process.env.BASE_URI,
    microservicePort: process.env.MICROSERVICE_PORT,

    frontUri: process.env.FRONT_URI,
    frontPort: process.env.FRONT_PORT,
};
