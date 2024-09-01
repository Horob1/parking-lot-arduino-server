import { Request, Response, NextFunction } from 'express'
import { logsService } from '~/services/logs.services'

export const getLogsByDateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dateString = req.params.date

    // Split the string into year, month, and day
    const [year, month, day] = dateString.split('-').map(Number)

    // Create a Date object (adjust month by subtracting 1 because months are zero-based)
    const date = new Date(Date.UTC(year, month - 1, day))
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
