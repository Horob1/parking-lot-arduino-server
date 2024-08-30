import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { usersService } from '~/services/users.services'

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body
    const newUser = await usersService.createUser(userData)
    res.status(201).json({ message: 'User created successfully', result: newUser })
  } catch (error) {
    next(error)
  }
}
export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params
    const updateData = req.body

    // Kiểm tra tính hợp lệ của userId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' })
    }

    await usersService.updateUser(userId, updateData)

    res.status(200).json({ message: 'User updated successfully' })
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
