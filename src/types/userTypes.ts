import { Field, InputType, ObjectType } from 'type-graphql'
import { FieldError } from '.'
import { User } from '../entities/user/User'

/**
 * User register, auth, login input type
 */
@InputType()
export class UserInput {
  @Field()
  email: string

  @Field()
  password: string
}

/**
 * User register, auth, login response scheme
 */
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError])
  errors: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => String, { nullable: true })
  accessToken?: string
}
