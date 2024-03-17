import express from "express";
import cors from "cors";
import session from "express-session";
import { createClient } from "redis";
import RedisStore from "connect-redis";

import middlewares from "@middlewares";
import endpoints from "@endpoints";
import { init as initCtx } from "@context";

/**
 * Create App bootstrap an express server with all the necessary middleware and routes.
 *
 * @returns {express.Application} The server app to run.
 */
export function createApp(): express.Application {
  /**
   * Initialize context for the global application runtime
   */
  initCtx();

  /**
   * Create Express application server
   */
  const app = express();

  // Initialize client.
  // redis[s]://[[username][:password]@][host][:port][/db-number]
  let redisClient = createClient({ url: "redis://localhost:6379" });
  redisClient.connect().catch(console.error);

  // Initialize store.
  let redisStore = new RedisStore({
    client: redisClient,
  });

  // Create session
  app.use(
    session({
      secret: "fXpfFgRHRGBFDG",
      resave: true,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 60000, httpOnly: false },
      store: redisStore,
    })
  );

  // Enable CORS
  app.use(cors( { origin: "http://localhost:3000", credentials: true } ));

  app.use("/", endpoints);
  app.use(middlewares.promiseCatcher);

  return app;
}
