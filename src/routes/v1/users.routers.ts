import { Router } from 'express'
import { createUserController, getAllUsersController, updateUserController } from '~/controllers/users.controllers'

const router = Router()
router.post('/', createUserController)
router.patch('/:id', updateUserController)
router.get('/', getAllUsersController)
export default router
