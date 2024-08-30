import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { IUser } from '~/models/database/User'
import { usersService } from '~/services/users.services'
export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    // Kiểm tra ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' })
    }
    const user = await usersService.getUser(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({
      message: 'User retrieved successfully',
      result: user
    })
  } catch (error) {
    next(error)
  }
}
export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, cccd, phone, type } = req.body
    // Kiểm tra các trường bắt buộc
    if (!name || !cccd || !phone || !type) {
      return res.status(400).json({ message: 'Name, CCCD, phone, and type are required' })
    }
    // Kiểm tra loại người dùng
    if (type !== 'user') {
      return res.status(400).json({ message: 'Invalid user type. Only "user" type is allowed.' })
    }
    const newUser: IUser = { name, cccd, phone, type }
    const result = await usersService.createUser(newUser)
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
  const { name, cccd, phone, type } = req.body
  try {
    const result = await usersService.updateUser(userId, { name, cccd, phone, type })
    if (result) {
      res.status(200).json({ message: 'User updated successfully' })
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
}
export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    // Kiểm tra tính hợp lệ của userId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' })
    }
    await usersService.deleteUser(userId)
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.params.page, 10) || 1 // Lấy page từ URL, mặc định là 1
    const limit = parseInt(req.query.limit as string, 5) || 5 // Lấy limit từ query parameters, mặc định là 10
    const result = await usersService.getAllUsers(page, limit)
    res.status(200).json({
      message: 'Users retrieved successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
