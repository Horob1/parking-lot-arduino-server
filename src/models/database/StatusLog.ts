import { ObjectId } from 'mongodb'

export interface IStatusLog {
  _id?: ObjectId
  slots: string
  createdAt?: Date
}
export class StatusLog {
  _id?: ObjectId
  slots: string
  createdAt?: Date

  constructor({ _id, slots, createdAt }: IStatusLog) {
    this._id = _id
    this.slots = slots
    this.createdAt = createdAt || new Date()
  }
}
