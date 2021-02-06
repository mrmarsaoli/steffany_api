/**
 * Middleware to check if request is authtenticated
 */
import 'dotenv/config'
import { ResolverContext } from '../types'
import { verify } from 'jsonwebtoken'
import { MiddlewareFn } from 'type-graphql'
import { LogError } from '../utils/log'

export const isAuth: MiddlewareFn<ResolverContext> = ({ context }, next) => {
  const auth = context.req.headers['authorization'] as string

  context.payload = {} as any

  if (!auth) {
    LogError(`not authenticated. There's no access token`)
    return next()
  }

  try {
    const token = auth.split(' ')[1]
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET as string)
    context.payload = payload as any
  } catch (err) {
    LogError('not authenticated. unexpected error')
  }

  return next()
}
