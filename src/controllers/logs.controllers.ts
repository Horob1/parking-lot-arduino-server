import { Request, Response, NextFunction } from 'express'
import { logsService } from '~/services/logs.services'

export const getLogsByDateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const date = new Date(req.params.date)
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' })
    }
    const logs = await logsService.getLogsByDate(date)
    res.status(200).json({ message: 'Logs retrieved successfully', result: logs })
  } catch (error) {
    next(error)
  }
}

export const getNewestLogController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const log = await logsService.getNewestLogController()
    res.status(200).json({ message: 'Log retrieved successfully', result: log })
  } catch (error) {
    next(error)
  }
}
