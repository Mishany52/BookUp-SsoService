export const config = {
    db: {
        entities: [`${__dirname}/../../entity/**/*.{js,ts}`],
    },
    jwtAccessSecrete: process.env.JWT_SECRET,
    jwtRefreshSecrete: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES,
    jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES,
};
