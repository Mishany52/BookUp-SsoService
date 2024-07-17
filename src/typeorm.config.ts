/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable filenames/match-exported */
import * as path from 'path';
import { DataSource, SimpleConsoleLogger } from 'typeorm';
import { config } from 'dotenv';
import { SSOLogger } from './infrastructure/logger/logger';

config({ path: '.env' });
const logger = new SSOLogger();

// eslint-disable-next-line @typescript-eslint/naming-convention
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.PORT),
    username: `${process.env.POSTGRES_USER}`,
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: `${process.env.POSTGRES_DB}`,
    synchronize: false,
    migrations: [path.join(__dirname, 'infrastructure', 'postgres', 'migrations', '/*.ts')],
    entities: [path.join(__dirname, '/../**/*.entity.ts')],
});

AppDataSource.initialize()
    .then(() => {
        logger.verbose('Data Source has been initialized!');
    })
    .catch((err) => {
        logger.verbose('Error during Data Source initialization', err);
    });

export default AppDataSource;
