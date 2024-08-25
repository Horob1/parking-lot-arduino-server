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

  constructor({ _id, uid, type, user, createdAt }: ICard) {
    this._id = _id
    this.uid = uid
    this.type = type
    this.user = user
    this.createdAt = createdAt || new Date()
  }
}
