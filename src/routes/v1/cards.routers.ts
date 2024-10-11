import { Router } from 'express'
import {
  createCardController,
  getAllCardsWithUsersController,
  updateCardUserController
} from '~/controllers/cards.controllers'
const router = Router()

router.get('/', getAllCardsWithUsersController)
router.post('/', createCardController)
router.patch('/:uid', updateCardUserController)
export default router
