import { ObjectId } from 'mongodb'
import { USERS_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { StatusLog } from '~/models/database/User'
import { IUser } from '~/models/database/User'

class UserService {
  async getUser(id: string): Promise<IUser | null> {
    const db = getDB()
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid ID format')
    }
    const user = (await db.collection(USERS_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })) as IUser
    return user
  }

  async createUser(data: IUser): Promise<any> {
    const db = getDB()
    // Kiểm tra trùng lặp số CCCD
    const existingUser = await db.collection(USERS_COLLECTION_NAME).findOne({
      $or: [{ cccd: data.cccd }]
    })
    if (existingUser) {
      throw new Error('CCCD already exists')
    }
    const result = await db.collection(USERS_COLLECTION_NAME).insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return result
  }
  async updateUser(id: string, updateData: Partial<IUser>): Promise<boolean> {
    const db = getDB()
    const result = await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    return result.modifiedCount > 0
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
  async getUserById(id: string): Promise<IUser | null> {
    const db = getDB()
    const objectId = new ObjectId(id)
    const result = await db.collection('users').findOne({ _id: objectId })
    if (result) {
      return {
        _id: result._id as ObjectId,
        name: result.name,
        cccd: result.cccd,
        phone: result.phone,
        type: result.type,
        createdAt: result.createdAt ? new Date(result.createdAt) : undefined,
        updatedAt: result.updatedAt ? new Date(result.updatedAt) : undefined
      }
    }
    return null
  }
}
export const usersService = new UserService()
