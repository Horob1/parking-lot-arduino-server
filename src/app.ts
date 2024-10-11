import express, { Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { initSocket } from './socket'
import cron from 'node-cron'
import { sendLogAtEndOfDays } from './utils/cron'
import router from './routes'
import cors from 'cors'
import path from 'path'
const app = express()

const httpServer = createServer(app)

app.use(cors({ origin: '*' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
//   res.send('Hello, World!')
// })
app.use('/api', router)
// cron.schedule('* * * * *', sendLogAtEndOfDays)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error:', err.message)
  res.status(404).json({ error: err.message })
})

app.use('/', express.static(path.join(__dirname, 'fe')))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fe', 'index.html'))
})

cron.schedule('5 0 * * *', sendLogAtEndOfDays)

initSocket(httpServer)
export default httpServer
