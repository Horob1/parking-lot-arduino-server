import { Router } from 'express'
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  updateUserController
} from '~/controllers/users.controllers'

const router = Router()

router.post('/createUser', createUserController)
router.put('/updateUser/:userId', updateUserController)
router.delete('/deleteUser/:userId', deleteUserController)
router.get('/getAllUsers/:page', getAllUsersController)
export default router
