import { Router } from 'express'
import {
  createUserController,
  deleteUserController,
  getAllUsersController,
  getUserController,
  updateUserController
} from '~/controllers/users.controllers'

const router = Router()
router.get('/getUser/:id', getUserController)
router.post('/createUser', createUserController)
router.patch('/updateUser/:id', updateUserController)
router.delete('/deleteUser/:userId', deleteUserController)
router.get('/getAllUsers', getAllUsersController)
export default router
