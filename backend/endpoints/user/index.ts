import { Router } from 'express'
import bodyParser from "body-parser";

import ctx from '@context'
import httpStatus from 'http-status';
import type { User as CircleUser, Session } from '@service/circle/types';

const router = Router()

router.post('/connect', bodyParser.json(), async (req, res, next) => {
    if (!req.body.name) {
        return next(new Error("field name is missing from request body."))
    }

    let userID: string
    try {
        const res = await ctx.prisma.user.findFirst({ where: { name: req.body.name } })
        if (!res?.id) {
            return next(new Error(`user ${req.body.name} not found.`))
        }

        userID = res.id
    } catch (error) {
        return next(new Error("could not find user in database.", { cause: error }))
    }

    // Connect to an existing user on Circle API
    try {
        const session = await ctx.circleSDK.connectUser({ userID })

        return res.status(httpStatus.OK).json({ message: "User connected!", session })
    } catch (error) {
        return next(new Error("could not connect to user.", { cause: error }))
    }
})

router.post('/register', bodyParser.json(), async (req, res, next) => {
    if (!req.body.name) {
        return next(new Error("field name is missing from request body."))
    }

    // Create a new user on Circle API
    let circleUser: CircleUser
    try {
        circleUser = await ctx.circleSDK.createUser({ name: req.body.name })
    } catch (error) {
        return next(new Error("could not create user.", { cause: error }))
    }

    try {
        // Save the user to the database
        const user = await ctx.prisma.user.create({
            data: { id: circleUser.userID, name: req.body.name },
        })

        return res.status(httpStatus.CREATED).json({ message: "User created!", circleUser })
    } catch (error) {
        return next(new Error("could not save user to database.", { cause: error }))
    }
})

router.get("", async (req, res, next) => {
    if (!req.body.userID) {
        return next(new Error("field userID is missing from request body."))
    }

    try {
        const user = await ctx.circleSDK.getUser(req.body.userID)

        return res.status(httpStatus.OK).json({ user })
    } catch (error) {
        return next(new Error("could not get user.", { cause: error }))
    }
})

export default router
