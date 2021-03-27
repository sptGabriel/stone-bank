import express from 'express'
import { Logger } from '../logger/logger'
import { setupApp } from './main/app'
import { setupErrorHandler } from './main/error-handler'
import { setupRoutes } from './main/routes'

export const SetupServer = () => {
  const port = process.env.APP_PORT
  const app = express()
  setupApp(app)
  setupRoutes(app)
  setupErrorHandler(app)
  app.listen(port, () => {
    Logger.log(`info`, `Server listening -> http://127.0.0.1:${port}`)
  })
}
