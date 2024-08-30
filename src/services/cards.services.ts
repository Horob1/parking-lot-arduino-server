import { ObjectId } from 'mongodb'
import { CARD_COLLECTION_NAME, USERS_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { Card, ICard } from '~/models/database/Card'

class CardService {
  async getAllCardsWithUsers() {
    const db = getDB()
    const cardsWithUsers = await db
      .collection('cards')
      .aggregate([
        {
          $lookup: {
            from: 'users', // Tên của collection users
            localField: 'user', // Trường liên kết trong collection cards
            foreignField: '_id', // Trường liên kết trong collection users
            as: 'userDetails' // Tên của trường mới chứa thông tin user
          }
        },
        {
          $unwind: '$userDetails' // Bỏ mảng trong kết quả lookup để nhận về một đối tượng user
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            type: 1,
            createdAt: 1,
            'userDetails._id': 1,
            'userDetails.name': 1,
            'userDetails.cccd': 1,
            'userDetails.phone': 1
          }
        }
      ])
      .toArray()
    return cardsWithUsers
  }
  async createCard(cardData: ICard): Promise<Card | null> {
    const { uid, user, type, createdAt } = cardData
    const db = getDB()
    // Kiểm tra người dùng có tồn tại không
    if (user) {
      const existingUser = await db.collection('users').findOne({ _id: new ObjectId(user) })
      if (!existingUser) {
        throw new Error('User does not exist')
      }
    }
    const card = new Card(cardData)
    const result = await db.collection(CARD_COLLECTION_NAME).insertOne(card)
    return result.insertedId ? card : null
  }
  async updateCardUser(uid: string, userId: string) {
    const db = getDB()
    const card = await db.collection('cards').findOne({ uid })
    if (!card) {
      throw new Error('Card not found')
    }
    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })
    if (!user) {
      throw new Error('User not found')
    }
    const result = await db
      .collection('cards')
      .findOneAndUpdate({ uid }, { $set: { user: new ObjectId(userId) } }, { returnDocument: 'after' })
    return result
  }
}
export const cardsService = new CardService()
