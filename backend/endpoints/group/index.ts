import { Router } from "express";
import bodyParser from "body-parser";
import httpStatus from "http-status";
import { validateRequest } from "zod-express-middleware";
import { z } from "zod";

import ctx from "@context";
import middlewares from "@middlewares";
import type { Organisation } from "@prisma/client";

const router = Router();

/**
 * Create a new group in the organisation.
 *
 * This method also call the smart contract to create the group and shall be called
 * by the owner of the organisation.
 * If we had time, we would add a verification system to check if the user is the owner
 * but we don't.
 */
router.post(
  "",
  middlewares.isLoggedIn,
  bodyParser.json(),
  validateRequest({
    body: z.object({
      name: z.string().min(1, { message: "name is required." }),
      organisationID: z.number().int().positive({ message: "organisationID is required." }),
      allocation: z.number().int().positive({ message: "allocation is required." }),
    }),
  }),
  async (req, res, next) => {
    const { name, organisationID, allocation } = req.body;
    const walletAddress = req.session.walletAddress as string;

    let organisation: Organisation | null;
    try {
      organisation = await ctx.prisma.organisation.findFirst({ where: { id: organisationID } });
      if (!organisation?.id) {
        return next(new Error(`organisation ${organisationID} not found.`));
      }
    } catch (error) {
      return next(new Error("could not get organisation.", { cause: error }));
    }

    const ensName = ctx.ensSDK.addBudalSuffix(`${name}.${organisation.name}`);

    // Check if ENS domain is available
    try {
      const isNameAvailable = await ctx.ensSDK.isENSAvailable(ensName);
      if (!isNameAvailable) {
        return next(new Error(`organisation name ${ensName} is not available.`));
      }
    } catch (error) {
      return next(new Error("could not check if organisation name is available.", { cause: error }));
    }

    // Register the subdomain
    try {
      await ctx.ensSDK.registerENSAddress(name, walletAddress, organisation.name);
    } catch (error) {
      return next(new Error("could not register the group name.", { cause: error }));
    }

    let challengeID: string;
    try {
      challengeID = await ctx.contractSDK.createGroup(
        {
          walletID: req.session.walletID as string,
          userToken: req.session.userToken as string,
        },
        {
          groupAddress: walletAddress,
          allocation: allocation,
          delays: 0,
        }
      );
    } catch (error) {
      return next(new Error("could not create group on contract.", { cause: error }));
    }

    try {
      const group = await ctx.prisma.group.create({
        data: {
          name: name,
          address: ensName,
          users: { connect: [{ id: req.session.userID as string }] },
          organisation: { connect: { id: organisationID } },
        },
      });

      return res.status(httpStatus.CREATED).json({ message: "Group created!", group, challengeID });
    } catch (error) {
      return next(new Error("could not create group.", { cause: error }));
    }
  }
);

/**
 * Add a user to a group.
 *
 * For simplicity and faster development, we are not checking if the user is already
 * in the group nor if he's part of the organisation.
 * This is something we would do in a real-world application though if we had more time.
 *
 * This method also call the smart contract to add the user wallet to the group.
 * NOTE: this method must be called by the contract owner only!
 * If we had time, we would implement a verification system but we don't.
 * 
 * This also create a sub ENS domain for the group (.e.g, <group>.<orga>.budal.eth)
 */
router.post(
  "/:groupID/add",
  middlewares.isLoggedIn,
  bodyParser.json(),
  validateRequest({
    body: z.object({
      targetID: z.string().min(1, { message: "targetID is required." }),
      groupAddress: z.string().min(1, { message: "groupAddress is required." }),
    }),
  }),
  async (req, res, next) => {
    const { targetID, groupAddress } = req.body;

    const groupID = req.params.groupID;
    if (!groupID) {
      return next(new Error("field groupID is missing from URL."));
    }

    let targetWallet: Awaited<ReturnType<typeof ctx.circleSDK.getUserWallet>>;
    try {
      targetWallet = await ctx.circleSDK.getUserWallet(targetID);
    } catch (error) {
      return next(new Error("could not retrieve user target wallets.", { cause: error }));
    }

    let challengeID: string;
    try {
      challengeID = await ctx.contractSDK.addUserToGroup(
        {
          walletID: req.session.walletID as string,
          userToken: req.session.userToken as string,
        },
        {
          groupAddress,
          userAddress: targetWallet.address,
        }
      );
    } catch (error) {
      return next(new Error("could not add user to group on contract.", { cause: error }));
    }

    try {
      const group = await ctx.prisma.group.findFirst({ where: { id: Number(groupID) } });
      if (!group?.id) {
        return next(new Error(`group ${groupID} not found.`));
      }

      await ctx.prisma.group.update({
        where: { id: group.id },
        data: { users: { connect: [{ id: targetID }] } },
      });

      return res.status(httpStatus.OK).json({ message: "User joined group!", group, challengeID });
    } catch (error) {
      return next(new Error("could not join group.", { cause: error }));
    }
  }
);

router.post(
  "/:groupID/addFound",
  middlewares.isLoggedIn,
  validateRequest({
    body: z.object({
      amount: z.number().int().positive({ message: "amount is required." }),
      groupAddress: z.string().min(1, { message: "groupAddress is required." }),
    }),
  }),
  async (req, res, next) => {
    const { amount, groupAddress } = req.body;

    let challengeID: string;
    try {
      challengeID = await ctx.contractSDK.addFound(
        {
          walletID: req.session.walletID as string,
          userToken: req.session.userToken as string,
        },
        {
          groupAddress: groupAddress,
          amount: amount,
        }
      );
      return res.status(httpStatus.OK).json({ message: "Add found request created!", challengeID });
    } catch (error) {
      return next(new Error("could not create group on contract.", { cause: error }));
    }
  }
);

router.post(
  "/:groupID/withdraw",
  middlewares.isLoggedIn,
  validateRequest({
    body: z.object({
      amount: z.number().int().positive({ message: "amount is required." }),
      groupAddress: z.string().min(1, { message: "groupAddress is required." }),
    }),
  }),
  async (req, res, next) => {
    const { amount, groupAddress } = req.body;

    let challengeID: string;
    try {
      challengeID = await ctx.contractSDK.withDraw(
        {
          walletID: req.session.walletID as string,
          userToken: req.session.userToken as string,
        },
        {
          // TODO(): Dynamic ENS
          groupAddress: groupAddress,
          amount: amount,
        }
      );

      return res.status(httpStatus.OK).json({ message: "Withdraw request created!", challengeID });
    } catch (error) {
      return next(new Error("could not create group on contract.", { cause: error }));
    }
  }
);

/**
 * Get a group by its ID.
 */
router.get("/:groupID", middlewares.isLoggedIn, async (req, res, next) => {
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
});

export default router;
