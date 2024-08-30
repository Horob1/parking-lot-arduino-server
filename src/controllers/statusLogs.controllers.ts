import { Request, Response, NextFunction } from 'express'
import { statusLogsService } from '~/services/statusLogs.services'

export const getStatusLogsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const statusLogs = await statusLogsService.getStatusLogs()
    res.status(200).json({ message: 'Status logs retrieved successfully', result: statusLogs })
  } catch (error) {
    console.error('Error:', error)
    next(error)
  }
}
