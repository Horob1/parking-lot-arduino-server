import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { IStatusLog } from '~/models/database/StatusLog'

class StatusLogsService {
  async getStatusLogs(): Promise<IStatusLog[]> {
    const db = getDB()
    const statusLogs = await db.collection('STATUS_LOG_COLLECTION_NAME').find().toArray()
    return statusLogs as IStatusLog[]
  }
}
export const statusLogsService = new StatusLogsService()
