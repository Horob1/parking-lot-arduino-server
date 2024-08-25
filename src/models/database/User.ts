import { ObjectId } from 'mongodb'

export interface IUser {
  _id?: ObjectId
  name: string
  cccd: string
  phone: string
  createdAt?: Date
  updatedAt?: Date
}

export class StatusLog {
  _id?: ObjectId
  name: string
  cccd: string
  phone: string
  createdAt?: Date
  updatedAt?: Date

  constructor({ _id, name, cccd, phone, createdAt, updatedAt }: IUser) {
    this._id = _id
    this.name = name
    this.cccd = cccd
    this.phone = phone
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
