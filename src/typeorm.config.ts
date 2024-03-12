/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable filenames/match-exported */
import * as path from 'path';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();
// eslint-disable-next-line @typescript-eslint/naming-convention
const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true,
    migrations: [path.join(__dirname, 'Infrastructure', 'postgres', 'migrations', '/*.ts')],
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
