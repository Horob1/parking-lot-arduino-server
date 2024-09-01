import { LOG_COLLECTION_NAME, STATUS_LOG_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { ILog } from '~/models/database/Log' // Đảm bảo import đúng model
import { IStatusLog } from '~/models/database/StatusLog'

class LogsService {
  async getLogsByDate(date: Date): Promise<ILog[]> {
    const db = getDB()

    // Create startOfDay and endOfDay in UTC
    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))

    // Query the database
    const logs = await db
      .collection(LOG_COLLECTION_NAME)
      .find({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      })
      .toArray()

    return logs as ILog[]
  }

  getNewestLogController = async () => {
    const logs = await getDB().collection(STATUS_LOG_COLLECTION_NAME).find({}).sort('-createdAt').toArray()
    if (logs.length > 0) return (logs[logs.length - 1] as IStatusLog).slots
    else return '0000'
  }
}
export const logsService = new LogsService()
