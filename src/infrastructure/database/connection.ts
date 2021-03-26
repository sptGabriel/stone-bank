import { retryPromise } from '~utils/RetryablePromise'
import knex, { Knex } from 'knex'
import { Logger } from '../logger/logger'
import {config} from './config'

export const Connection = {
  client: (null as unknown) as Knex<any, unknown[]>,
  async connect(): Promise<void> {
    Logger.log(`info`, `Starting the - database`, {})
    try {
      this.client = await knex(config)
      await retryPromise({
        fn: this.client.raw(`select 1+1 as result`),
        retries: 5,
        interval: 1000,
        logger: Logger,
        retryMsg: `Attempted connections to the remaining database`,
      })
      Logger.log(`info`, `Starting migrations`, {})
      await this.client.migrate.latest()
    Logger.log(`info`, `Connected to the database`, {})
    } catch (error) {
      Logger.log(`info`, `Error while starting database`, error)
      throw error;
    }
  },
  async disconnect(): Promise<void> {
    await this.client.destroy()
  }
}
