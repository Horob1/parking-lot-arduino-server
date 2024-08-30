import { Router } from 'express'
import { createLogController, getLogsController } from '~/controllers/logs.controllers'

const router = Router()

router.post('/createLog', createLogController)
router.get('/getLogs', getLogsController)
export default router
