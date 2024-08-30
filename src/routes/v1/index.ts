import { Router } from 'express'
import cardsRouter from './cards.routers'
import usersRouter from './users.routers'
import logsRouter from './logs.routers'
import warningsRouter from './war.routers'
const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'hello word' })
})

router.use('/cards', cardsRouter)
router.use('/users', usersRouter)
router.use('/logs', logsRouter)
router.use('/warnings', warningsRouter)
export default router
