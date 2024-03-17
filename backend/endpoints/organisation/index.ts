import { Router } from "express";
import bodyParser from "body-parser";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";
import httpStatus from "http-status";

import ctx from "@context";
import middlewares from "@middlewares";

const router = Router();

/**
 * Add a user to an organisation.
 *
 * In a real world implementation, we would check if the user is allowed to join the organisation
 * but also an invitation system with notification etc...
 * Unfortunately, we don't have time to implement a production ready organisation system :)
 *
 * We would also check if the users wallet is correctly setup in the Circle API.
 */
router.post(
  "/:organisationID/add",
  middlewares.isLoggedIn,
  bodyParser.json(),
  validateRequest({
    body: z.object({
      username: z.string().min(1, { message: "username is required." }),
    }),
  }),
  async (req, res, next) => {
    const { username } = req.body;

    const organisationID = req.params.organisationID;
    if (!organisationID) {
      return next(new Error("field organisationID is missing from URL."));
    }

    console.debug(`Looking for organisation ${organisationID}`)
    try {
      const organisation = await ctx.prisma.organisation.findFirst({ where: { id: Number(organisationID) } });
      if (!organisation?.id) {
        return next(new Error(`organisation ${organisationID} not found.`));
      }

      console.debug(`Adding user ${username} to organisation ${organisation.name}`)
      await ctx.prisma.organisation.update({
        where: { id: organisation.id },
        data: { users: { connect: [{ name: username }] } },
      });

      return res.status(httpStatus.OK).json({ message: "User joined organisation!", organisation });
    } catch (error) {
      return next(new Error("could not join organisation.", { cause: error }));
    }
  }
);

/**
 * Create a new organisation.
 *
 * In a real world application, we would check if the user is allowed to create an organisation.
 * We could also add more metadata related to the organisation, such as the address, the industry, etc...
 *
 * The users shall also have a valid wallet on Circle API before performing this operation.
 * 
 * This also creates a sub domain for the organisation on ENS (.e.g, <orga>.budal.eth)
 */
router.post(
  "",
  middlewares.isLoggedIn,
  bodyParser.json(),
  validateRequest({
    body: z.object({
      name: z.string().min(1, { message: "name is required." }),
    }),
  }),
  async (req, res, next) => {
    const { name } = req.body;
    const ensName = ctx.ensSDK.addBudalSuffix(name);

    const walletAddress = req.session.walletAddress as string;

    console.debug(`Checking if organisation name ${ensName} is available`)
    // Check if ENS domain is available
    try {
      const isNameAvailable = await ctx.ensSDK.isENSAvailable(ensName);
      if (!isNameAvailable) {
        return next(new Error(`organisation name ${ensName} is not available.`));
      }
    } catch (error) {
      return next(new Error("could not check if organisation name is available.", { cause: error }));
    }

    console.debug(`Registering organisation name ${ensName} with wallet ${walletAddress}`)
    // Register the subdomain
    try {
      await ctx.ensSDK.registerENSAddress(name, walletAddress);
    } catch (error) {
      return next(new Error("could not register organisation name.", { cause: error }));
    }

    console.debug(`Creating organisation ${name} in the contract`)
    let challengeID: string;
    try {
      challengeID = await ctx.contractSDK.ownContract(
        {
          walletID: req.session.walletID as string,
          userToken: req.session.userToken as string,
        },
        {
          walletAddress: req.session.walletAddress as string,
        }
      );
    } catch (error) {
      return next(new Error("could not transfer contract ownership.", { cause: error }));
    }

    console.debug(`Creating organisation ${name} in the database`)
    try {
      const organisation = await ctx.prisma.organisation.create({
        data: { name: name, address: ensName, users: { connect: [{ id: req.session.userID }] } },
      });

      return res.status(httpStatus.CREATED).json({ message: "Organisation created!", organisation, challengeID });
    } catch (error) {
      return next(new Error("could not create organisation.", { cause: error }));
    }
  }
);

/**
 * Get an organisation by its ID.
 */
router.get("/:organisationID", middlewares.isLoggedIn, async (req, res, next) => {
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
