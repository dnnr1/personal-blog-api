import 'dotenv/config';
import type { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  migrations: {
    directory: path.join(__dirname, 'src', 'db', 'migrations'),
  },
};

export default config;
