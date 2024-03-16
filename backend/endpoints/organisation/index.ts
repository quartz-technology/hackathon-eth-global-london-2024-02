import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";

const router = Router();

router.post("/join", bodyParser.json(), async (req, res, next) => {
    if (!req.body.name) {
        return next(new Error("field name is missing from request body."));
    }
    
    if (!req.body.userID) {
        return next(new Error("field userID is missing from request body."));
    }
    
    try {
        const org = await ctx.prisma.organisation.findFirst({ where: { name: req.body.name } });
        if (!org?.id) {
        return next(new Error(`organisation ${req.body.name} not found.`));
        }
    
        await ctx.prisma.organisation.update({
        where: { id: org.id },
        data: { users: { connect: [{ id: req.body.userID }] } },
        });
    
        res.status(httpStatus.OK).json({ message: "User joined organisation!", org });
    } catch (error) {
        return next(new Error("could not join organisation.", { cause: error }));
    }
})

router.post("", bodyParser.json(), async (req, res, next) => {
  if (!req.body.name) {
    return next(new Error("field name is missing from request body."));
  }

  if (!req.body.userID) {
    return next(new Error("field userID is missing from request body."));
  }

  try {
    const org = await ctx.prisma.organisation.create({
      data: { name: req.body.name, users: { connect: [{ id: req.body.userID }] } },
    });
    res.status(httpStatus.CREATED).json({ message: "Organisation created!", org });
  } catch (error) {
    return next(new Error("could not create organisation.", { cause: error }));
  }
});

export default router;
