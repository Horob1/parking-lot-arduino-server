import { Router } from 'express'
import { deleteWarningController, getWarningsController } from '~/controllers/warnings.controllers'
const router = Router()

router.get('/getWarnings', getWarningsController)
router.delete('/deleteWarning/:id', deleteWarningController)
export default router
