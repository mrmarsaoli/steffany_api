import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { ObjectType, Field, Int } from 'type-graphql'
import { User } from '../user/User'

@ObjectType()
@Entity()
export class Shift {
  @Field(() => Int)
  @PrimaryKey()
  id!: number

  @Field(() => User)
  @ManyToOne({ entity: () => User, fieldName: 'user' })
  user!: User

  @Field(() => String)
  @Property({ length: 100 })
  name: string

  @Field(() => String)
  @Property({ type: 'date' })
  start!: Date

  @Field(() => String)
  @Property({ type: 'date' })
  end!: Date

  @Field(() => String)
  @Property({ type: 'date' })
  created = new Date()

  @Field(() => String)
  @Property({ type: 'date', onUpdate: () => new Date() })
  updated = new Date()

  @Field(() => Int)
  @Property({ default: 0 })
  published!: number
}
