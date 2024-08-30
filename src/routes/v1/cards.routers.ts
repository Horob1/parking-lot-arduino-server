import { Router } from 'express'
import {
  createCardController,
  getAllCardsWithUsersController,
  updateCardUserController
} from '~/controllers/cards.controllers'
const router = Router()

router.get('/cardsWithUsers', getAllCardsWithUsersController)
router.post('/createCard', createCardController)
router.patch('/updateCardUser/:uid', updateCardUserController)
export default router
