import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";

const router = Router();

router.post("/:organisationID/add", bodyParser.json(), async (req, res, next) => {
  const { userID } = req.body;
  if (!userID) {
    return next(new Error("field userID is missing from request body."));
  }

  const organisationID = req.params.organisationID;
  if (!organisationID) {
    return next(new Error("field organisationID is missing from URL."));
  }

  try {
    const organisation = await ctx.prisma.organisation.findFirst({ where: { id: Number(organisationID) } });
    if (!organisation?.id) {
      return next(new Error(`organisation ${organisationID} not found.`));
    }

    await ctx.prisma.organisation.update({
      where: { id: organisation.id },
      data: { users: { connect: [{ id: userID }] } },
    });

    return res.status(httpStatus.OK).json({ message: "User joined organisation!", organisation });
  } catch (error) {
    return next(new Error("could not join organisation.", { cause: error }));
  }
});

router.post("", bodyParser.json(), async (req, res, next) => {
  const { name, userID } = req.body;
  if (!name) {
    return next(new Error("field name is missing from request body."));
  }

  if (!userID) {
    return next(new Error("field userID is missing from request body."));
  }

  try {
    const organisation = await ctx.prisma.organisation.create({
      data: { name: name, users: { connect: [{ id: userID }] } },
    });

    return res.status(httpStatus.CREATED).json({ message: "Organisation created!", organisation });
  } catch (error) {
    return next(new Error("could not create organisation.", { cause: error }));
  }
});

router.get("/:organisationID", async (req, res, next) => {
  const organisationID = req.params.organisationID;
  if (!organisationID) {
    return next(new Error("field organisationID is missing from request body."));
  }

  try {
    const organisation = await ctx.prisma.organisation.findFirst({
      where: { id: Number(organisationID) },
      include: { groups: true, users: true },
    });
    if (!organisation?.id) {
      return next(new Error(`organisation ${organisationID} not found.`));
    }

    return res.status(httpStatus.OK).json({ message: "Organisation found!", organisation });
  } catch (error) {
    return next(new Error("could not find organisation.", { cause: error }));
  }
});

export default router;
