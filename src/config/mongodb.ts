import { Db, MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'
let databaseInstance: Db

const client = new MongoClient(env.DATABASE_URL as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    // strict: true,
    deprecationErrors: true
  }
})

export const connectDB = async () => {
  await client.connect()
  databaseInstance = client.db(env.DATABASE_NAME)
}

export const getDB = () => {
  if (!databaseInstance) throw new Error('Must connect to Database first!')
  return databaseInstance
}

export const CLOSE_DB = async () => {
  await client.close()
}
