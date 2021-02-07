import { Request, Response } from 'express'
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { ObjectType, Field, InputType, Int } from 'type-graphql'

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

@InputType()
export class InputOptions {
  [key: string]: any

  @Field(() => String, { nullable: true, defaultValue: 'id' })
  orderBy?: string

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  desc?: boolean

  @Field(() => Int, { nullable: true, defaultValue: 7 })
  limit?: number

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number
}
