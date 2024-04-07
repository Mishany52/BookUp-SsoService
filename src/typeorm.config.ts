/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable filenames/match-exported */
import * as path from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.env' });
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
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });

export default AppDataSource;
