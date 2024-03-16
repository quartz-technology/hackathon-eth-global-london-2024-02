import { Router } from 'express'

import healthcheck from './healthcheck'
import organisation from './organisation'

const router = Router()

router.use('/healthcheck', healthcheck)
router.use('/organisation', organisation)

export default router