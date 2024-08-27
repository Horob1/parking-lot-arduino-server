import { Server as HttpServer } from 'http'

import { Server } from 'socket.io'
import {
  CARD_COLLECTION_NAME,
  LOG_COLLECTION_NAME,
  STATUS_LOG_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
  WARNING_COLLECTION_NAME
} from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { FULL_STATUS } from '~/constants/common'
import { Log } from '~/models/database/Log'
import { StatusLog } from '~/models/database/StatusLog'
import { Warning } from '~/models/database/Warning'
import { getBill } from '~/utils/common'

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    /* options */
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
  })

  io.on('connection', async (socket) => {
    console.log('User connected:', socket.id)

    socket.on('connect_error', (err) => {
      console.log('Connection error:', err.message)
    })

    socket.on('update', async (payload: { data: string }) => {
      const data = payload.data.slice(0, payload.data.length - 1)
      await getDB()
        .collection(STATUS_LOG_COLLECTION_NAME)
        .insertOne(new StatusLog({ slots: data }))
      // handle full slots
      const isFull = data === FULL_STATUS
      const maxSlots = await getDB().collection(LOG_COLLECTION_NAME).countDocuments({ isPaid: false })
      if (isFull && maxSlots !== 4) {
        const warning = await getDB()
          .collection(WARNING_COLLECTION_NAME)
          .insertOne(
            new Warning({
              desc: `Slots or database log are problem! Check now!`
            })
          )
        //bắn socket cảnh báo đến client
        io.emit('warning', warning)
        io.emit('ui-update', data)
        //bắn socket đến especially
        return socket.emit('full-slots', { isFull: false })
      }
      io.emit('full-status', { isFull: isFull })
      io.emit('ui-update', data)
    })

    socket.on('check-in', async (payload: { uid: string }) => {
      const uid = payload.uid.slice(0, payload.uid.length - 1)
      const card = await getDB().collection(CARD_COLLECTION_NAME).findOne({ uid })

      if (!card) return socket.emit('invalid-check-in-card')

      const isExist = await getDB().collection(LOG_COLLECTION_NAME).findOne({ card: card._id, isPaid: false })

      if (isExist) {
        const warning = await getDB()
          .collection(WARNING_COLLECTION_NAME)
          .insertOne(
            new Warning({
              card: card._id,
              desc: `Card ${uid} is duplicated! Check now!`
            })
          )
        //bắn socket đến client
        io.emit('warning', warning)
        return io.emit('check-in-card-in-use')
      }

      if (card.type == 'guest') {
        const log = new Log({ card: card._id, isPaid: false })
        await getDB().collection(LOG_COLLECTION_NAME).insertOne(log)
        return io.emit('check-in-guest-success')
      }
      if (card.type == 'user') {
        const log = new Log({ card: card._id, user: card.user, isPaid: false })
        const [, user] = await Promise.all([
          getDB().collection(LOG_COLLECTION_NAME).insertOne(log),
          getDB().collection(USERS_COLLECTION_NAME).findOne({ _id: card.user })
        ])
        if (!user) {
          const warning = await getDB()
            .collection(WARNING_COLLECTION_NAME)
            .insertOne(
              new Warning({
                card: card._id,
                desc: `Cannot find user with card ${uid}! Check now!`
              })
            )
          // bắn lỗi tới client
          io.emit('warning', warning)
          return io.emit('invalid-check-in-user')
        }
        io.emit('check-in-user-success', { name: user.name })
      }
    })

    socket.on('check-out', async (payload: { uid: string }) => {
      const uid = payload.uid.slice(0, payload.uid.length - 1)
      const card = await getDB().collection(CARD_COLLECTION_NAME).findOne({ uid })

      if (!card) return socket.emit('invalid-check-out-card')

      const log = await getDB().collection(LOG_COLLECTION_NAME).findOne({ card: card._id, isPaid: false })

      if (!log) {
        const warning = await getDB()
          .collection(WARNING_COLLECTION_NAME)
          .insertOne(
            new Warning({
              desc: 'Check out gate now',
              card: card._id
            })
          )
        // bắn soket đến client ngay
        io.emit('warning', warning)
        return io.emit('check-out-card-is-not-in-use')
      }

      const bill = card.type == 'guest' ? getBill(log.createdAt) : null

      await getDB()
        .collection(LOG_COLLECTION_NAME)
        .updateOne({ _id: log._id }, { $set: { isPaid: true, checkedOutAt: new Date(), bill: bill } })

      if (card.type === 'guest')
        return io.emit('check-out-guest-success', { money: (bill as number).toString() + 'vnd' })

      if (card.type === 'user') {
        const user = await getDB().collection(USERS_COLLECTION_NAME).findOne({ _id: card.user })

        if (!user) {
          const warning = await getDB()
            .collection(WARNING_COLLECTION_NAME)
            .insertOne(
              new Warning({
                card: card._id,
                desc: `Cannot find user with card ${uid}! Check now!`
              })
            )
          // bắn lỗi tới client
          io.emit('warning', warning)
          return io.emit('invalid-check-out-user')
        }
        io.emit('check-out-user-success', { name: user.name })
      }
    })

    socket.on('open-in', () => io.emit('open-gate-in'))
    socket.on('open-out', () => io.emit('open-gate-out'))
    socket.on('close-out', () => io.emit('close-gate-out'))
    socket.on('close-in', () => io.emit('close-gate-in'))

    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${reason}`)
    })
  })
}
