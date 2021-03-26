import express from 'express'
import { Logger } from '../logger/logger'
import { setupApp } from './main/app'
import { setupErrorHandler } from './main/error-handler'
import { setupRoutes } from './main/routes'

const port = process.env.NODE_ENV || 8080
export const SetupServer = () => {
  const app = express()
  setupApp(app)
  setupRoutes(app)
  setupErrorHandler(app)
  app.listen(port, () => {
    Logger.log(`info`, `Server listening -> http://127.0.0.1:${port}`)
  })
}
