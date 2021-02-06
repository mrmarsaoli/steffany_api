import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field(() => String)
  @Property({ unique: true, length: 100 })
  email!: string

  @Property({ columnType: 'text' })
  password!: string

  @Field(() => Int)
  @Property({ default: 0 })
  tokenVersion: number
}
