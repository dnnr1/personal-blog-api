import type { Knex } from 'knex';
import 'dotenv/config';
import path from 'path';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      database: process.env.POSTGRES_DB || 'myapp_dev',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'password',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src', 'db', 'migrations'),
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT) || 5432,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.join(__dirname, 'src', 'db', 'migrations'),
    },
  },
};

export default config;
