import type { Response } from "express";

export function isLoggedIn(req: any, res: Response, next: any) {
    if (req.session.userID && req.session.userToken && req.session.walletID && req.session.walletAddress) {
        console.debug("User is logged in.")
        next();
    } else {
        console.debug("User is not logged in.", req.session.userID, req.session.userToken, req.session.walletID, req.session.walletAddress)
        return res.status(401).json({ message: "Unauthorized" });
    }
}