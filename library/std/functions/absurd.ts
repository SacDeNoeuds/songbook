import { useLogger } from '../logger/logger'

export function absurd(value: never): never {
  const logger = useLogger()
  logger.error('expected never, got:', value)
  throw new Error('absurd')
}
