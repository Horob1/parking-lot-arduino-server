import { ObjectId } from 'mongodb'
import { LOG_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { ILog } from '~/models/database/Log' // Đảm bảo import đúng model
import { IStatusLog } from '~/models/database/StatusLog'

class LogsService {
  async getLogsByDate(date: Date): Promise<ILog[]> {
    const db = getDB()
    console.log('Input Date:', date.toISOString()) // Log input date in UTC

    // Create startOfDay and endOfDay in UTC
    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0))
    const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999))

    console.log('Start of Day:', startOfDay.toISOString()) // Log start of day in UTC
    console.log('End of Day:', endOfDay.toISOString()) // Log end of day in UTC

    // Query the database
    const logs = await db
      .collection(LOG_COLLECTION_NAME)
      .find({
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      })
      .toArray()

    return logs as ILog[]
  }
}
export const logsService = new LogsService()
