import winston from 'winston'
import { loggerConfig as config } from './config'

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
})

export const Logger = winston.createLogger(config)
