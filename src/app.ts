import express from 'express'
import { createServer } from 'http'
import { initSocket } from './socket'
import cron from 'node-cron'
import { sendLogAtEndOfDays } from './utils/cron'
const app = express()

const httpServer = createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// cron.schedule('* * * * *', sendLogAtEndOfDays)

cron.schedule('5 0 * * *', sendLogAtEndOfDays)

initSocket(httpServer)
export default httpServer
