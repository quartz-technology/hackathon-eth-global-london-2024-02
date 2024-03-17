import { Router } from "express";
import bodyParser from "body-parser";

import ctx from "@context";
import httpStatus from "http-status";
import type { User as CircleUser } from "@service/circle/types";
import type { Session } from "@service/circle";

import middlewares from "@middlewares";

const router = Router();

/**
 * Connect to an existing user on Circle API.
 *
 * In a real-world application, we would implement an authentication system using basic auth
 * or on chain impelmentation to ensure that the user is who he says he is.
 */
router.post("/connect", bodyParser.json(), async (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    return next(new Error("field name is missing from request body."));
  }

  let userID: string;
  try {
    const res = await ctx.prisma.user.findFirst({ where: { name: name } });
    if (!res?.id) {
      return next(new Error(`user ${name} not found.`));
    }

    userID = res.id;
  } catch (error) {
    return next(new Error("could not find user in database.", { cause: error }));
  }

  let session: Session;
  // Connect to an existing user on Circle API
  try {
    session = await ctx.circleSDK.connectUser({ userID });
  } catch (error) {
    return next(new Error("could not connect to user.", { cause: error }));
  }

  let userWallet: Awaited<ReturnType<typeof ctx.circleSDK.getUserWallet>>;
  try {
    userWallet = await ctx.circleSDK.getUserWallet(userID);
  } catch (error) {
    return next(new Error("could not retrieve user wallets.", { cause: error }));
  }

  req.session.userID = userID;
  req.session.userToken = session.userToken;
  req.session.walletID = userWallet.id;
  req.session.walletAddress = userWallet.address;

  // Save session
  req.session.save();

  return res.status(httpStatus.OK).json({ message: "User connected!", user: { ...session, userID: userID } });
});

/**
 * Register a new user on Circle API.
 *
 * In a real-world application, we would implement an authentication system using basic auth or
 * on chain authentication system.
 * We could also add more metadata related to the user, such as the email, the phone number, etc...
 */
router.post("/register", bodyParser.json(), async (req, res, next) => {
  const name = req.body.name;
  if (!name) {
    return next(new Error("field name is missing from request body."));
  }

  // Create a new user on Circle API
  let circleUser: CircleUser;
  try {
    circleUser = await ctx.circleSDK.createUser({ name: name });
  } catch (error) {
    return next(new Error("could not create user.", { cause: error }));
  }

  try {
    // Save the user to the database
    const user = await ctx.prisma.user.create({
      data: { id: circleUser.userID, name: req.body.name },
    });

    return res.status(httpStatus.CREATED).json({ message: "User created!", user: circleUser });
  } catch (error) {
    return next(new Error("could not save user to database.", { cause: error }));
  }
});

/**
 * Get the organisation of a user.
 */
router.get("/organisation", middlewares.isLoggedIn, async (req, res, next) => {
  const userID = req.session.userID;

  try {
    const userOrganisation = await ctx.prisma.user.findFirst({
      where: { id: userID },
      include: { organisations: true, groups: true },
    });

    return res.status(httpStatus.OK).json({ ...userOrganisation });
  } catch (error) {
    return next(new Error("could not get user organisation.", { cause: error }));
  }
});

/**
 * Get a user by its ID.
 */
router.get("", middlewares.isLoggedIn, async (req, res, next) => {
  const userID = req.session.userID as string;

  try {
    const user = await ctx.circleSDK.getUser(userID);
    if (!user) {
      return next(new Error(`user ${userID} not found.`));
    }

    return res.status(httpStatus.OK).json({ user });
  } catch (error) {
    return next(new Error("could not get user.", { cause: error }));
  }
});

router.get("/challenge", middlewares.isLoggedIn, async (req, res, next) => {
  const userToken = req.session.userToken as string;

  try {
    const challenges = await ctx.circleSDK.getUserChallenges(userToken);

    return res.status(httpStatus.OK).json({ message: "User challenges!", challenges });
  } catch (error) {
    return next(new Error("could not create group on contract.", { cause: error }));
  }

})
export default router;
