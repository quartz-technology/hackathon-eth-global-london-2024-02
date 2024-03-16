import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";

const router = Router();

/**
 * Create a new group in the organisation.
 */
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

/**
 * Add a user to a group.
 * 
 * For simplicity and faster development, we are not checking if the user is already 
 * in the group nor if he's part of the organisation.
 * This is something we would do in a real-world application though if we had more time.
 */
router.post("/:groupID/add", bodyParser.json(), async (req, res, next) => {
    const { userID } = req.body;
    if (!userID) {
      return next(new Error("field userID is missing from request body."));
    }

    const groupID = req.params.groupID;
    if (!groupID) {
      return next(new Error("field groupID is missing from request body."));
    }

    try {
      const group = await ctx.prisma.group.findFirst({ where: { id: Number(groupID) } });
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

/**
 * Get a group by its ID.
 */
router.get("/:groupID", async (req, res, next) => {
  const groupID = req.params.groupID;
  if (!groupID) {
    return next(new Error("field groupID is missing from request body."));
  }

  try {
    const group = await ctx.prisma.group.findFirst({
      where: { id: Number(groupID) },
      include: { users: true, organisation: true },
    });
    if (!group?.id) {
      return next(new Error(`group ${groupID} not found.`));
    }

    return res.status(httpStatus.OK).json({ ...group });
  } catch (error) {
    return next(new Error("could not get group.", { cause: error }));
  }
})

export default router;
