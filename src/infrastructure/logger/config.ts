import dotenv from 'dotenv'
import { format, transports } from 'winston'
dotenv.config()

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

const formatLogger = format.combine(
  // Add the message timestamp with the preferred format
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Tell Winston that the logs must be colored
  format.colorize({ all: true }),
  format.json(),
  // Define the format of the message showing the timestamp, the level and the message
  format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
)
const Loggertransports = [
  // Allow the use the console to print the messages
  new transports.Console(),
  // Allow to print all the error level messages inside the error.log file
  new transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  new transports.File({ filename: 'logs/all.log' }),
]
export const loggerConfig = {
  level: level(),
  levels,
  format: formatLogger,
  transports: Loggertransports,
}
