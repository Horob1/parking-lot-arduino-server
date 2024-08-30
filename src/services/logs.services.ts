import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { LOG_COLLECTION_NAME } from '~/config/collections'
import { ILog } from '~/models/database/Log'

class LogService {
  async createLog(data: ILog): Promise<any> {
    const db = getDB()

    const result = await db.collection(LOG_COLLECTION_NAME).insertOne({
      ...data,
      createdAt: data.createdAt || new Date(),
      checkedOutAt: data.checkedOutAt
    })
    return result
  }
  async getLogs(): Promise<ILog[]> {
    const db = getDB()
    const logs = (await db.collection(LOG_COLLECTION_NAME).find({}).toArray()) as ILog[]
    return logs
  }
}

export const logService = new LogService()
