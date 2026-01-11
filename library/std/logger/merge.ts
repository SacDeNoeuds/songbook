import type { Logger } from './logger'

export const mergeLoggers = (...loggers: Logger[]): Logger => ({
  debug: (...args) => loggers.forEach((logger) => logger.debug(...args)),
  info: (...args) => loggers.forEach((logger) => logger.info(...args)),
  warn: (...args) => loggers.forEach((logger) => logger.warn(...args)),
  error: (...args) => loggers.forEach((logger) => logger.error(...args)),
})
