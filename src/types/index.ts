import { Request, Response } from 'express'
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { ObjectType, Field } from 'type-graphql'

export interface ResolverContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
  req: Request
  res: Response
  payload?: { userId: string; errors: FieldError[] }
}

@ObjectType()
export class FieldError {
  @Field()
  field: string

  @Field()
  message: string
}
