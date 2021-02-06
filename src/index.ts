import 'dotenv/config'
import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import mikroConfig from './mikro-orm.config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
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

  app.listen(4000, () => {
    console.log('server running on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
