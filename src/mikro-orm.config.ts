import 'dotenv/config'
import { __prod__ } from './constants'
import { MikroORM } from '@mikro-orm/core'
import path from 'path'

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.ts$/
  },
  dbName: process.env.DB_NAME,
  type: 'sqlite',
  debug: !__prod__,
  entities: ['./dist/entities/**/*.js'], // path to your JS entities (dist), relative to `baseDir`
  entitiesTs: ['./src/entities/**/*.ts']
} as Parameters<typeof MikroORM.init>[0]
