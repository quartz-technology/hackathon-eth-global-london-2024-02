import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";

const router = Router();

router.post("", bodyParser.json(), async (req, res, next) => {
  const { name, userID, organisationID } = req.body;
  if (!name) {
    return next(new Error("field name is missing from request body."));
  }

  if (!userID) {
    return next(new Error("field userID is missing from request body."));
  }

  if (!organisationID) {
    return next(new Error("field organisationID is missing from request body."));
  }

  try {
    const group = await ctx.prisma.group.create({
      data: { name: name, users: { connect: [{ id: userID }] }, organisation: { connect: { id: organisationID } } },
    });

    return res.status(httpStatus.CREATED).json({ message: "Group created!", group });
  } catch (error) {
    return next(new Error("could not create group.", { cause: error }));
  }
});

router.post("/add", bodyParser.json(), async (req, res, next) => {
    const { groupID, userID } = req.body;
    if (!groupID) {
      return next(new Error("field groupID is missing from request body."));
    }

    if (!userID) {
      return next(new Error("field userID is missing from request body."));
    }

    try {
      const group = await ctx.prisma.group.findFirst({ where: { id: groupID } });
      if (!group?.id) {
        return next(new Error(`group ${groupID} not found.`));
      }

      await ctx.prisma.group.update({
        where: { id: group.id },
        data: { users: { connect: [{ id: userID }] } },
      });

      return res.status(httpStatus.OK).json({ message: "User joined group!", group });
    } catch (error) {
      return next(new Error("could not join group.", { cause: error }));
    }
})

export default router;
