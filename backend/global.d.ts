declare global {
    declare module 'express-session' {
      interface SessionData {
        userID: string
        userToken: string
        walletID: string
        walletAddress: string;
      }
    }
  }