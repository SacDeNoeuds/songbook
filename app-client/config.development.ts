import type { Config } from './config'

export const config: Config = {
  environment: 'development',
  version: new Date().toISOString().slice(0, 19).replace('T', ' '),
  // apiUrl: 'http://localhost:8083',
  logLevel: 'Debug',
}
