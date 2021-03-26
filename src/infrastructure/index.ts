import { Connection } from './database/connection'
import { SetupServer } from './http/http-server'

(async () => {
  try {
    await Connection.connect()
    SetupServer()
  } catch (error) {
    throw error
  }
})()
