import { Request, Response, NextFunction } from 'express'
import { cardsService } from '~/services/cards.services'

export const getCardController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const card = await cardsService.getCard(cardId)

    if (!card) {
      return res.status(404).json({ message: 'Card not found' })
    }

    res.status(200).json({ message: 'Card retrieved successfully', result: card })
  } catch (error) {
    next(error)
  }
}
export const getUserByCardIdController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const user = await cardsService.getUserByCardId(cardId)
    res.status(200).json({ message: 'User retrieved successfully', result: user })
  } catch (error) {
    next(error)
  }
}
export const createCardController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cardData = req.body
    const cardId = await cardsService.createCard(cardData)

    res.status(201).json({
      message: 'Card created successfully',
      result: {
        _id: cardId
      }
    })
  } catch (error) {
    next(error)
  }
}
export const updateCardUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    await cardsService.updateCardUser(cardId, userId)

    res.status(200).json({ message: 'User updated in card successfully' })
  } catch (error) {
    next(error)
  }
}
