import express from 'express'
import { createServer } from 'http'
import { initSocket } from './socket'
const app = express()

const httpServer = createServer(app)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

initSocket(httpServer)
export default httpServer
