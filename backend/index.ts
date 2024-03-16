import express from "express";
import cors from "cors"

import config from "@config"
import middlewares from '@middlewares'
import endpoints from '@endpoints'
import { init as initCtx } from "@context";

/**
 * Initialize context for the global application runtime
 */
initCtx()

/**
 * Create Express application server
 */
const app = express();

// Enable CORS
app.use(cors())

app.use("/", endpoints)
app.use(middlewares.promiseCatcher);

/**
 * Start server
 */
app.listen(config.port, () => {
  console.log(`Listening on port http://0.0.0.0.:${config.port}...`);
});
