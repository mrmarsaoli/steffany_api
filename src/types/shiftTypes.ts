import { Field, InputType, Int, ObjectType } from 'type-graphql'
import { FieldError, InputOptions } from '.'
import { Shift } from '../entities/shift/Shift'

/**
 * Shift list input type
 */
@InputType()
export class ShiftListInput extends InputOptions {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  user?: number

  @Field(() => String, { nullable: true })
  name?: string

  @Field(() => String, { nullable: true })
  start?: string

  @Field(() => String, { nullable: true })
  end?: string

  @Field(() => String, { nullable: true })
  created?: string

  @Field(() => String, { nullable: true })
  updated?: string

  @Field(() => String, { nullable: true })
  published?: number
}

/**
 * Shift list response scheme
 */
@ObjectType()
export class ShiftListResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError

  @Field(() => [Shift], { nullable: true })
  shifts?: Shift[]
}

/**
 * Create shift input type
 */
@InputType()
export class CreateShiftInput {
  @Field(() => String)
  name: string

  @Field(() => Date)
  start: Date

  @Field(() => Date)
  end: Date

  @Field(() => String)
  published: number
}

/**
 * Edit shift input type
 */
@InputType()
export class EditShiftInput extends CreateShiftInput {
  @Field(() => Int)
  id: number
}

/**
 * Shift response
 */
@ObjectType()
export class ShiftResponse {
  @Field(() => [FieldError])
  errors: FieldError[]

  @Field(() => Shift, { nullable: true })
  shift?: Shift
}

/**
 * Delete shift response
 */
@ObjectType()
export class DeleteShiftResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean
}

@ObjectType()
export class BulkingError extends FieldError {
  @Field(() => Int)
  id: number
}

/**
 * Publish shift response
 */
@ObjectType()
export class PublishShiftResponse {
  @Field(() => FieldError, { nullable: true })
  error?: FieldError

  @Field(() => [BulkingError])
  bulkingErrors: BulkingError[]

  @Field(() => Boolean)
  success: boolean
}
