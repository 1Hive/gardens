import { QueryResult } from '@aragon/connect-thegraph'
import Config from '../../models/Config'
import { IGardenConnector } from 'src/types'

export function parseConfig(result: QueryResult, connector: IGardenConnector): Config | null {
  const config = result.data.config
  if (!config) {
    throw new Error('Unable to parse config.')
  }

  return new Config(config, connector)
}
