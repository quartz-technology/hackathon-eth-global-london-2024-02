import { Router } from 'express'

import healthcheck from './healthcheck'
import organisation from './organisation'
import user from './user'

const router = Router()

router.use('/healthcheck', healthcheck)
router.use('/organisation', organisation)
router.use('/user', user)

export default router