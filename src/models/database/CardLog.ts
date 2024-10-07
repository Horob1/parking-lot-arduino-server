import { ObjectId } from 'mongodb'

interface ICardLog {
  _id?: ObjectId
  card: ObjectId
  user: ObjectId
}

export class CardLog {
  _id?: ObjectId
  card: ObjectId
  user: ObjectId

  constructor({ _id, card, user }: ICardLog) {
    this._id = _id
    this.card = card
    this.user = user
  }
}
