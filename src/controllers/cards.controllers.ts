import { Request, Response, NextFunction } from 'express'
import { cardsService } from '~/services/cards.services'

export const getAllCardsWithUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardsWithUsers = await cardsService.getAllCardsWithUsers()
    res.status(200).json({ message: 'Cards with users retrieved successfully', result: cardsWithUsers })
  } catch (error) {
    next(error)
  }
}
export const createCardController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, type } = req.body
    const newCard = await cardsService.createCard({ uid, type })
    res.status(201).json({ message: 'Card created successfully', result: newCard })
  } catch (error) {
    next(error)
  }
}
export const updateCardUserController = async (req: Request, res: Response, next: NextFunction) => {
  const { uid } = req.params
  try {
    const updatedCard = await cardsService.updateCardUser(uid)
    res.status(200).json({ message: 'User updated in card successfully', result: updatedCard })
  } catch (error) {
    next(error)
  }
}
