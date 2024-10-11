import { ObjectId } from 'mongodb'

export interface ICard {
  _id?: ObjectId
  uid: string
  type: string
  createdAt?: Date
}
export class Card {
  _id?: ObjectId
  uid: string
  type: string
  createdAt?: Date

  constructor({ _id, uid, createdAt }: ICard) {
    this._id = _id
    this.uid = uid
    this.type = 'user'
    this.createdAt = createdAt || new Date()
  }
}
