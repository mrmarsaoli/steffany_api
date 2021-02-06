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
import { UserResolver } from './resolvers/user/UserResolver'

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
      validate: false
    }),
    context: ({ req, res }): ResolverContext => ({ em: orm.em, req, res })
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(4000, () => {
    console.log('server running on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
