import { Router } from 'express'

import healthcheck from './healthcheck'
import organisation from './organisation'
import user from './user'
import group from './group'

const router = Router()

router.use('/healthcheck', healthcheck)
router.use('/organisation', organisation)
router.use('/user', user)
router.use('/group', group)

export default router