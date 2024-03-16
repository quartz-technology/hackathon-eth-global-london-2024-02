import { Router } from 'express'
import bodyParser from "body-parser";

import ctx from '@context'

const router = Router()

router.post('', bodyParser.json(), async (req, res, next) => {
    if (!req.body.name) {
        return next(new Error("field name is missing from request body."))
    }

    try {
        const org = await ctx.circleSDK.createOrganisation({ name: req.body.name })
        res.json({ message: "Organisation created!", org })
    } catch (error) {
        return next(new Error("could not create organisation.", { cause: error }))
    }
})

export default router