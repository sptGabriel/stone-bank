import { Connection } from './database/connection'
import { SetupServer } from './http/http-server'
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    SetupServer()
    await Connection.connect()
  } catch (error) {
    throw error
  }
})()
