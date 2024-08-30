import { Router } from 'express'
import {
  createCardController,
  getCardController,
  getUserByCardIdController,
  updateCardUserController
} from '~/controllers/cards.controllers'
const router = Router()

router.get('/getCard/:cardId', getCardController)
router.get('/getUserByCardId/:cardId', getUserByCardIdController)
router.post('/createCard', createCardController)
router.put('/updateCardUser/:cardId', updateCardUserController)
export default router
