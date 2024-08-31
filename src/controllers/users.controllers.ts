import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { IUser } from '~/models/database/User'
import { usersService } from '~/services/users.services'

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, cccd, phone, card } = req.body
    // Kiểm tra các trường bắt buộc
    if (!name || !cccd || !phone) {
      return res.status(400).json({ message: 'Name, CCCD, phone, and type are required' })
    }
    // Kiểm tra loại người dùng

    const newUser: IUser = { name, cccd, phone }
    const result = await usersService.createUser(newUser, card)
    res.status(201).json({
      message: 'User created successfully',
      result: result.insertedId
    })
  } catch (error) {
    next(error)
  }
}
export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  const { name, cccd, phone, card, oldCard } = req.body
  try {
    await usersService.updateUser(userId, { name, cccd, phone }, card, oldCard)

    res.status(200).json({ message: 'User updated successfully' })
  } catch (error) {
    next(error)
  }
}

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await usersService.getAllUsers()
    res.status(200).json({
      message: 'Users retrieved successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
