import { ObjectId } from 'mongodb'

export interface IWarning {
  _id?: ObjectId
  card: ObjectId
  desc: string
  createdAt?: Date
}
export class Warning {
  _id?: ObjectId
  card: ObjectId
  desc: string
  createdAt?: Date

  constructor({ _id, card, desc, createdAt }: IWarning) {
    this._id = _id
    this.card = card
    this.desc = desc
    this.createdAt = createdAt || new Date()
  }
}
