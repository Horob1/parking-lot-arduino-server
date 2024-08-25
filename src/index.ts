/**
 * Updated by Horob1 on July 13 2024
 */
//server
import server from './app'
import { env } from './config/environment'
import { CLOSE_DB, connectDB } from './config/mongodb'
import exitHook from 'async-exit-hook'
import ip from 'ip'

const PORT = env.PORT || 3000

connectDB()
  .then(() => {
    console.log('Connected to MongoDB!')
    console.log('BUILD_MODE: ', env.NODE_ENV)
    console.log(ip.address())
    server.listen({ port: PORT }, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    })
    exitHook(() => {
      CLOSE_DB()
    })
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB: ', error)
    process.exit(0)
  })
