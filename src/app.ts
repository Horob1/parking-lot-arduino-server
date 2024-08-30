import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { initSocket } from './socket'
import cron from 'node-cron'
import { sendLogAtEndOfDays } from './utils/cron'
import router from './routes'
const app = express()

const httpServer = createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello, World!')
})
app.use('/api', router)
// cron.schedule('* * * * *', sendLogAtEndOfDays)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error:', err.message)
  res.status(404).json({ error: err.message })
})
cron.schedule('5 0 * * *', sendLogAtEndOfDays)

initSocket(httpServer)
export default httpServer
