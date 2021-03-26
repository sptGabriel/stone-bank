import * as dotenv from 'dotenv'
import { Knex } from 'knex'
dotenv.config()

interface KnexConfig {
  [name: string]: Knex.Config
}

const enviroment = process.env.NODE_ENV || 'development'

const knexConfigs: KnexConfig = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST,
      user: process.env.PG_USER,
      password: process.env.PG_PWD,
      database: process.env.PGDB_NAME,
      port: Number(process.env.PG_PORT),
    },
    pool: {
      min: 0,
      max: 5,
      acquireTimeoutMillis: 60000,
      idleTimeoutMillis: 600000,
    },
    migrations: {
      directory: 'src/infrastructure/database/migrations',
      extension: 'ts',
    },
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: 'src/infrastructure/database/migrations',
    },
  },
}

const config = knexConfigs[enviroment] || knexConfigs['development']
export { config }
