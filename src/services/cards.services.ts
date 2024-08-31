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
        { $match: {} }, // This will match all documents in the collection
        {
          $lookup: {
            from: 'users', // The 'users' collection
            localField: 'user', // The field in 'cards' that relates to '_id' in 'users'
            foreignField: '_id', // The field in 'users' that is related to 'user' in 'cards'
            as: 'user' // The field that will contain the user data
          }
        },
        {
          $unwind: {
            path: '$user', // Unwind the 'user' field
            preserveNullAndEmptyArrays: true // Keep documents even if there is no corresponding user
          }
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            type: 1,
            createdAt: 1,
            user: 1 // Include the 'user' field in the final output
          }
        }
      ])
      .toArray()

    return cardsWithUsers
  }
  async createCard(cardData: ICard) {
    const { uid, type } = cardData
    const db = getDB()
    const isExisted = await db.collection(CARD_COLLECTION_NAME).findOne({ uid: uid })
    if (isExisted) {
      throw new Error('Card already exists')
    }
    // Kiểm tra người dùng có tồn tại không
    const card = new Card(cardData)
    const newCard = await db.collection(CARD_COLLECTION_NAME).insertOne(card)
    return await db.collection(CARD_COLLECTION_NAME).findOne({ _id: newCard.insertedId })
  }
  async updateCardUser(uid: string) {
    const db = getDB()
    const card = await db.collection('cards').findOne({ uid })
    if (!card) {
      throw new Error('Card not found')
    }
    const result = await db
      .collection('cards')
      .findOneAndUpdate({ uid }, { $set: { user: null } }, { returnDocument: 'after' })
    return result
  }
}
export const cardsService = new CardService()
