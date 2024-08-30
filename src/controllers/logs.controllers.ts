import { Request, Response, NextFunction } from 'express'
import { ObjectId } from 'mongodb'
import { logService } from '~/services/logs.services'

export const createLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { card, user, isPaid, bill, createdAt, checkedOutAt } = req.body

    const result = await logService.createLog({
      card: new ObjectId(card),
      user: user ? new ObjectId(user) : undefined,
      isPaid,
      bill,
      createdAt: createdAt ? new Date(createdAt) : undefined,
      checkedOutAt: checkedOutAt ? new Date(checkedOutAt) : undefined
    })

    res.status(201).json({
      message: 'Log created successfully',
      result
    })
  } catch (error) {
    next(error)
  }
}
export const getLogsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const logs = await logService.getLogs()
    res.status(200).json({
      message: 'Logs retrieved successfully',
      result: logs
    })
  } catch (error) {
    next(error)
  }
}
