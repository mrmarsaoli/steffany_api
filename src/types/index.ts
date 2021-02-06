import { Request, Response } from 'express'
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'

export interface ResolverContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
  req: Request
  res: Response
}
