import { Router } from 'express'
import { getLogsByDateController, getNewestLogController } from '~/controllers/logs.controllers'

const router = Router()
router.get('/logsByDate/:date', getLogsByDateController)
router.get('/getNewestLog', getNewestLogController)

export default router
