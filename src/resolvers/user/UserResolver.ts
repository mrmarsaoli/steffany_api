import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { User } from '../../entities/user/User'
import argon2 from 'argon2'
import EmailValidator from 'email-validator'
import { FieldError, ResolverContext } from '../../types'
import { UserInput, UserResponse } from '../../types/UserTypes'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
} from '../../utils/auth'
import { isAuth } from '../../middlewares/isAuth'
import { Log } from '../../utils/log'

@Resolver()
export class UserResolver {
  /**
   * Check authentication
   * Will return current user data if passed
   */
  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async authenticate(
    @Ctx() { em, payload }: ResolverContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = []
    const id = Number(payload!.userId)

    if (!id) {
      errors.push({
        field: 'user',
        message: 'user is not authenticated'
      })

      return { errors }
    }

    const user = await em.findOne(User, { id: id })

    if (!user) {
      errors.push({
        field: 'user',
        message: 'user is not registered'
      })

      return { errors }
    }

    return { user, errors }
  }

  /**
   * User registration
   * @param params
   */
  @Mutation(() => UserResponse)
  async register(
    @Arg('params') params: UserInput,
    @Ctx() { em }: ResolverContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = []
    if (!EmailValidator.validate(params.email)) {
      errors.push({
        field: 'email',
        message: 'email is not valid'
      })
    }
    if (params.password.length <= 4) {
      errors.push({
        field: 'password',
        message: 'password must be longer than 4 characters'
      })
    }

    if (errors.length) {
      return { errors }
    }

    const hashedPassword = await argon2.hash(params.password)
    const user = em.create(User, {
      email: params.email,
      password: hashedPassword
    })

    try {
      await em.persistAndFlush(user)
    } catch (err) {
      Log(err)

      if (err.sqlMessage.includes('Duplicate')) {
        return {
          errors: [
            {
              field: 'email',
              message: 'email is already registered '
            }
          ]
        }
      }
      return {
        errors: [
          {
            field: 'general',
            message: 'something unexpected happen'
          }
        ]
      }
    }

    return { user, errors }
  }

  /**
   * User login
   * @param params
   */
  @Mutation(() => UserResponse)
  async login(
    @Arg('params') params: UserInput,
    @Ctx() { em, res }: ResolverContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = []

    // check if the user has registered
    const user = await em.findOne(User, { email: params.email })

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email is not registered!'
          }
        ]
      }
    }

    // check password validity
    const valid = await argon2.verify(user.password, params.password)
    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'email and password mismatch!'
          }
        ]
      }
    }

    sendRefreshToken(res, createRefreshToken(user))

    return {
      user,
      errors,
      accessToken: createAccessToken(user)
    }
  }
}
