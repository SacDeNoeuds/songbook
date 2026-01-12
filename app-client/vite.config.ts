import path from 'node:path'
import type { UserConfig } from 'vite'
import { analyzer } from 'vite-bundle-analyzer'
import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'

const env = process.env.NODE_ENV || 'development'
console.debug(`Building app for env "${env}"`)
const { config: appConfig } = await import(`./config.${env}.ts`)

const config: UserConfig = {
  publicDir: './assets',
  base: env === 'production' ? '/songbook' : undefined,
  define: {
    __CONFIG__: JSON.stringify(appConfig),
  },
  build: {
    minify: env === 'production' ? 'terser' : false,
    outDir: 'build/',
  },
  server: { port: 1234 },
  worker: { format: 'es' },

  plugins: [
    tsconfigPaths({
      root: path.resolve(__dirname, '..'),
      projects: ['./tsconfig.json'],
    }),
    VitePWA({
      manifestFilename: 'manifest.json',
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ttf}'],
      },
      includeManifestIcons: true,
      manifest: {
        name: 'Songbook',
        short_name: 'Songbook',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#6989c0',
        background_color: '#f8f4f1',
        display: 'standalone',
      },
    }),
    analyzer({ analyzerMode: env === 'production' ? 'static' : 'server' }),
  ],
}

export default config
