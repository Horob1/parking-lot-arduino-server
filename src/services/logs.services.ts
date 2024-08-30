import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { ILog } from '~/models/database/Log' // Đảm bảo import đúng model
import { IStatusLog } from '~/models/database/StatusLog'

class LogsService {
  async getLogsByDate(date: Date): Promise<ILog[]> {
    const db = getDB()
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))
    const logs = await db
      .collection('LOG_COLLECTION_NAME')
      .find({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      })
      .toArray()
    return logs as ILog[]
  }
  async getStatusLogs(): Promise<IStatusLog[]> {
    const db = getDB()

    const statusLogs = await db.collection('STATUS_LOG_COLLECTION_NAME').find().toArray()
    return statusLogs as IStatusLog[]
  }
}
export const logsService = new LogsService()
