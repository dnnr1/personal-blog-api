import { Knex } from "knex";
import "dotenv/config";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: "./src/db/migrations",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
  pool: {
    min: 2,
    max: 10,
  },
  acquireConnectionTimeout: 10000,
  debug: true,
};

export default config;
