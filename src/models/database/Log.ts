import { ObjectId } from 'mongodb'

export interface ILog {
  _id?: ObjectId
  card: ObjectId
  isPaid: boolean
  bill?: number
  user?: ObjectId
  createdAt?: Date
  checkedOutAt?: Date
}
export class Log {
  _id?: ObjectId
  card: ObjectId
  user?: ObjectId
  isPaid: boolean
  createdAt?: Date
  checkedOutAt?: Date

  constructor({ _id, card, user, isPaid, createdAt }: ILog) {
    this._id = _id
    this.card = card
    this.user = user
    this.isPaid = isPaid
    this.createdAt = createdAt || new Date()
  }
}
