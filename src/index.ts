import 'reflect-metadata'
import { MikroORM } from '@mikro-orm/core'
import mikroConfig from './mikro-orm.config'
import express from 'express'

const main = async () => {
  const orm = await MikroORM.init(mikroConfig)
  await orm.getMigrator().up()

  const app = express()

  app.listen(4000, () => {
    console.log('server running on localhost:4000')
  })
}

main().catch((err) => {
  console.log(err)
})
