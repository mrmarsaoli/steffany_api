import 'dotenv/config'
import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import mikroConfig from './mikro-orm.config'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { ResolverContext } from './types'
import { Log } from './utils/log'
import { verify } from 'jsonwebtoken'
import { User } from './entities/user/User'
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken
} from './utils/auth'
import { UserResolver } from './resolvers/user/UserResolver'
import { ShiftResolver } from './resolvers/shift/ShiftResolver'

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()

  const app = express()

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
    })
  )

  app.use(cookieParser())

  app.post('/refresh-token', async (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME as string]

    if (!token) {
      return res.send({ ok: false, accessToken: '' })
    }

    let payload: any = null

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET as string)
    } catch (error) {
      Log(error)
      return res.send({ ok: false, accessToken: '' })
    }

    const user = await orm.em.findOne(User, { id: payload.userId })

    if (!user) {
      return res.send({ ok: false, accessToken: '' })
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: '' })
    }

    sendRefreshToken(res, createRefreshToken(user))
    return res.send({ ok: true, accessToken: createAccessToken(user) })
  })

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, ShiftResolver],
      validate: false
    }),
    context: ({ req, res }): ResolverContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    Log('server running on localhost:4000')
  })
}

main().catch((err) => {
  Log(err)
})
