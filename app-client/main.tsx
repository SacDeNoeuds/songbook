import { ConsoleLogger } from '@std/logger/console'
import { LogLevel, provideLogger } from '@std/logger/logger'
import { App } from './app-component'
import { AppModel } from './app-model'
import { config } from './config'
import './css'

const logger = provideLogger(ConsoleLogger(LogLevel[config.logLevel]))
logger.debug({ config })

// provideRouteProxy({
//   proxyRoute: () => identity,
// })

// const history = provideHistory(BrowserHistory({ href: window.location.href }))
const app = AppModel()

const root = document.getElementById('root')
if (!root) throw new Error('root not found')

root.replaceChildren(<App model={app} />)
