import { ObjectId } from 'mongodb'

export interface ICard {
  _id?: ObjectId
  uid: string
  user?: ObjectId
  type: string
  createdAt?: Date
}
export class Card {
  _id?: ObjectId
  uid: string
  user?: ObjectId
  type: string
  createdAt?: Date

  constructor({ _id, uid, user, createdAt, type }: ICard) {
    this._id = _id
    this.uid = uid
    this.user = user
    this.type = type
    this.createdAt = createdAt || new Date()
  }
}
