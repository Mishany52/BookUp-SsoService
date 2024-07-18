export interface IDevelopConfig {
    db: {
        type: string;
        synchronize: boolean;
        logging: boolean;
        host: string;
        port: string;
        username: string;
        password: string;
        database: string;
        autoLoadEntities: boolean;
    };
}

export interface ICommonConfig {
    jwtAccessSecrete: string;
    jwtRefreshSecrete: string;
    jwtRefreshExpires: string;
    jwtAccessExpires: string;

    apiPort: number;
    apiName: string;

    baseUri: string;
    microservicePort: number;

    frontUri: string;
    frontPort: number;
}

export interface IConfig extends ICommonConfig, IDevelopConfig {}
