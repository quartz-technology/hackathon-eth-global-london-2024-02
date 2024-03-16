import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";

const router = Router();

/**
 * Create a new group in the organisation.
 */
router.post("", bodyParser.json(), async (req, res, next) => {
  const { name, userID, userToken, organisationID, allocation } = req.body;
  if (!name) {
    return next(new Error("field name is missing from request body."));
  }

  if (!userID) {
    return next(new Error("field userID is missing from request body."));
  }

  if (!userToken) {
    return next(new Error("field userToken is missing from request body."));
  }

  if (!organisationID) {
    return next(new Error("field organisationID is missing from request body."));
  }

  if (!allocation) {
    return next(new Error("field allocation is missing from request body."));
  }

  let userWallet: Awaited<ReturnType<typeof ctx.circleSDK.getUserWallet>>[number];
  try {
    const wallets = await ctx.circleSDK.getUserWallet(userID);
    if (wallets.length === 0) {
      return next(new Error(`user ${userID} does not have a wallet.`));
    }

    const wallet = wallets[0];
    if (wallet.state !== "LIVE") {
      return next(new Error(`user ${userID} wallet is not active.`));
    }

    userWallet = wallet;
  } catch (error) {
    return next(new Error("could not retrieve user wallets.", { cause: error }));
  }

  let challengeID: string
  try {
    challengeID = await ctx.contractSDK.createGroup({
      walletID: userWallet.id,
      userToken,
      
    }, {
      members: [],
      // TODO(): Dynamic ENS
      groupAddress: "0x1e6754B227C6ae4B0ca61D82f79D60660737554a",
      allocation: allocation,
      delays: 0
    });
  } catch (error) {
    return next(new Error("could not create group on contract.", { cause: error }));
  }

  try {
    const group = await ctx.prisma.group.create({
      data: { name: name, users: { connect: [{ id: userID }] }, organisation: { connect: { id: organisationID } } },
    });

    return res.status(httpStatus.CREATED).json({ message: "Group created!", group, challengeID });
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
    const { userID, userToken, targetID, groupAddress } = req.body;
    if (!userID) {
      return next(new Error("field userID is missing from request body."));
    }

    if (!targetID) {
      return next(new Error("field targetID is missing from request body."));
    }

    if (!userToken) {
      return next(new Error("field userToken is missing from request body."));
    }

    if (!groupAddress) {
      return next(new Error("field groupAddress is missing from request body."));
    }

    let userWallet: Awaited<ReturnType<typeof ctx.circleSDK.getUserWallet>>[number];
    try {
      const wallets = await ctx.circleSDK.getUserWallet(userID);
      if (wallets.length === 0) {
        return next(new Error(`user ${userID} does not have a wallet.`));
      }
  
      const wallet = wallets[0];
      if (wallet.state !== "LIVE") {
        return next(new Error(`user ${userID} wallet is not active.`));
      }
  
      userWallet = wallet;
    } catch (error) {
      return next(new Error("could not retrieve user wallets.", { cause: error }));
    }

    let targetWallet: Awaited<ReturnType<typeof ctx.circleSDK.getUserWallet>>[number];
    try {
      const wallets = await ctx.circleSDK.getUserWallet(targetID);
      if (wallets.length === 0) {
        return next(new Error(`user ${userID} does not have a wallet.`));
      }
  
      const wallet = wallets[0];
      if (wallet.state !== "LIVE") {
        return next(new Error(`user ${userID} wallet is not active.`));
      }
  
      targetWallet = wallet;
    } catch (error) {
      return next(new Error("could not retrieve user target wallets.", { cause: error }));
    }

    let challengeID: string
    try {
      challengeID = await ctx.contractSDK.addUserToGroup({
        walletID: userWallet.id,
        userToken,
        
      }, {
        groupAddress,
        userAddress: targetWallet.address,
      });
    } catch (error) {
      return next(new Error("could not add user to group on contract.", { cause: error }));
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

      return res.status(httpStatus.OK).json({ message: "User joined group!", group, challengeID });
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
