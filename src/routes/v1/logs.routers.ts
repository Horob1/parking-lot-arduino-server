import { Router } from 'express'
import { getLogsByDateController } from '~/controllers/logs.controllers'

const router = Router()
router.get('/logsByDate/:date', getLogsByDateController)

export default router
