import { ObjectId } from 'mongodb'
import { CARD_COLLECTION_NAME, USERS_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { User } from '~/models/database/User'
import { IUser } from '~/models/database/User'

class UserService {
  async createUser(data: IUser, card: string): Promise<any> {
    const db = getDB()
    const existingUser = await db.collection(USERS_COLLECTION_NAME).findOne({
      cccd: data.cccd
    })
    if (existingUser) {
      throw new Error('CCCD already exists')
    }
    const newId = new ObjectId()
    if (card !== '') {
      const updatedCard = await db.collection(CARD_COLLECTION_NAME).updateOne(
        { uid: card, type: 'user' },
        {
          $set: {
            user: newId
          }
        }
      )
      if (updatedCard.matchedCount === 0 && card !== '') {
        throw new Error('Card not found')
      }
    }
    const result = await db.collection(USERS_COLLECTION_NAME).insertOne(new User({ _id: newId, ...data }))
    return result
  }
  async updateUser(id: string, updateData: Partial<IUser>, card: string, oldCard: string) {
    const db = getDB()
    await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    if (card === oldCard) {
      return
    }
    const [foundedOldCard, foundedCard] = await Promise.all([
      db.collection('cards').updateOne(
        { uid: oldCard, type: 'user' },
        {
          $set: {
            user: null
          }
        }
      ),
      db.collection('cards').updateOne({ uid: card, type: 'user' }, { $set: { user: new ObjectId(id) } })
    ])

    if ((foundedCard.matchedCount === 0 && card !== '') || (foundedOldCard.matchedCount === 0 && oldCard !== '')) {
      throw new Error('Card not found')
    }
  }

  async getAllUsers() {
    const db = getDB()
    const users = await db
      .collection(USERS_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: 'cards',
            localField: '_id',
            foreignField: 'user',
            as: 'card'
          }
        },
        {
          $unwind: {
            path: '$card',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            cccd: 1,
            phone: 1,
            createdAt: 1,
            updatedAt: 1,
            card: 1
          }
        }
      ])
      .toArray()

    return users
  }
}
export const usersService = new UserService()
