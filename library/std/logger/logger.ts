import { Context } from '../context'

export type Logger = {
  debug: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
}

export enum LogLevel {
  Debug,
  Info,
  Warn,
  Error,
}

const noop = () => {}
const noopLogger: Logger = { debug: noop, info: noop, warn: noop, error: noop }

export const WithLevel =
  (logger: Logger) =>
  (level: LogLevel): Logger => ({
    debug: level === LogLevel.Debug ? logger.debug : noop,
    info: level <= LogLevel.Info ? logger.info : noop,
    warn: level <= LogLevel.Warn ? logger.warn : noop,
    error: level <= LogLevel.Error ? logger.error : noop,
  })

export const [provideLogger, useLogger] = Context<Logger>('logger')
provideLogger(noopLogger) // default logger.
