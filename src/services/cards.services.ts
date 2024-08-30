import { ObjectId } from 'mongodb'
import { CARD_COLLECTION_NAME, USERS_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { ICard } from '~/models/database/Card'

class CardService {
  async getCard(cardId: string) {
    if (!ObjectId.isValid(cardId)) {
      throw new Error('Invalid card ID')
    }

    const card = await getDB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) })

    if (!card) {
      throw new Error('Card not found')
    }

    return card
  }
  async getUserByCardId(cardId: string) {
    const card = await getDB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(cardId) })

    if (!card || !card.user) {
      throw new Error('Card not found or no associated user')
    }

    const user = await getDB().collection(USERS_COLLECTION_NAME).findOne({ _id: card.user })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  }
  async createCard(cardData: ICard): Promise<ObjectId> {
    const result = await getDB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne({
        ...cardData,
        createdAt: new Date()
      })

    return result.insertedId
  }
  async updateCardUser(cardId: string, userId: string): Promise<void> {
    const db = getDB()

    if (!ObjectId.isValid(cardId) || !ObjectId.isValid(userId)) {
      throw new Error('Invalid card ID or user ID')
    }
    const user = await db.collection(USERS_COLLECTION_NAME).findOne({ _id: new ObjectId(userId) })
    if (!user) {
      throw new Error('User not found')
    }
    await db
      .collection(CARD_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(cardId) }, { $set: { user: new ObjectId(userId), updatedAt: new Date() } })
  }
}

export const cardsService = new CardService()
