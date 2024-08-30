import { warningService } from '~/services/war.services'
import { Request, Response, NextFunction } from 'express'

export const getWarningsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const warnings = await warningService.getWarnings()

    res.status(200).json({
      message: 'Warnings retrieved successfully',
      result: warnings
    })
  } catch (error) {
    next(error)
  }
}
export const deleteWarningController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params
    const result = await warningService.deleteWarning(id)
    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: 'Warning not found'
      })
    }
    res.status(200).json({
      message: 'Warning deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
