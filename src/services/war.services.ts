import { ObjectId } from 'mongodb'
import { getDB } from '~/config/mongodb'
import { WARNING_COLLECTION_NAME } from '~/config/collections'
import { IWarning } from '~/models/database/Warning' // Đảm bảo đường dẫn chính xác

class WarningService {
  async getWarnings(): Promise<IWarning[]> {
    const db = getDB()
    const warnings = (await db.collection(WARNING_COLLECTION_NAME).find({}).toArray()) as IWarning[]
    return warnings
  }
  async deleteWarning(id: string): Promise<any> {
    const db = getDB()
    const result = await db.collection(WARNING_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  }
}

export const warningService = new WarningService()
