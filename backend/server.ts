import express from "express";
import cors from "cors";

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

  // Enable CORS
  app.use(cors());

  app.use("/", endpoints);
  app.use(middlewares.promiseCatcher);

  return app;
}
