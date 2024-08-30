import { ObjectId } from 'mongodb'
import { USERS_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { StatusLog } from '~/models/database/User'
import { IUser } from '~/models/database/User'

class UserService {
  async getUser(user_id: string) {
    return await getDB()
      .collection(USERS_COLLECTION_NAME)
      .findOne(
        { _id: new ObjectId(user_id) },
        {
          projection: {
            password: 0
          }
        }
      )
  }
  async getUserByCardUid(uid: string) {
    return await getDB()
      .collection(USERS_COLLECTION_NAME)
      .findOne(
        { cardUid: uid },
        {
          projection: {
            password: 0
          }
        }
      )
  }
  async createUser(data: IUser): Promise<any> {
    const db = getDB()
    // Kiểm tra trùng lặp số CCCD và số điện thoại
    const existingUser = await db.collection(USERS_COLLECTION_NAME).findOne({
      $or: [{ cccd: data.cccd }, { phone: data.phone }]
    })
    if (existingUser) {
      throw new Error('CCCD or phone number already exists')
    }
    const result = await db.collection(USERS_COLLECTION_NAME).insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return result
  }
  async updateUser(userId: string, updateData: Partial<IUser>): Promise<void> {
    const result = await getDB()
      .collection(USERS_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(userId) }, { $set: { ...updateData, updatedAt: new Date() } })

    if (result.matchedCount === 0) {
      throw new Error('User not found')
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await getDB()
      .collection(USERS_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(userId) })

    if (result.deletedCount === 0) {
      throw new Error('User not found')
    }
  }
  async getAllUsers(page: number, limit: number) {
    const db = getDB()

    const users = await db
      .collection(USERS_COLLECTION_NAME)
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    const totalUsers = await db.collection(USERS_COLLECTION_NAME).countDocuments({})

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page
    }
  }
}
export const usersService = new UserService()
