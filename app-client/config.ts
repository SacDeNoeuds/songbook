import type { LogLevel } from '@std/logger/logger'

export type Config = {
  environment: 'development' | 'production'
  version: string
  // apiUrl: string
  logLevel: keyof typeof LogLevel
}

// Injected by the bundler
declare const __CONFIG__: Config
export const config = __CONFIG__
