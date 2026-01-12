import type { Config } from './config'

export const config: Config = {
  environment: 'production',
  version: new Date().toISOString().slice(0, 19).replace('T', ' '),
  // apiUrl: 'https://songbook.bypasta.studio/api',
  logLevel: 'Info',
}
