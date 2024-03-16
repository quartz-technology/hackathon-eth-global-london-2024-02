import express from "express";

import config from "@config"
import middlewares from '@middlewares'
import endpoints from '@endpoints'
import { initContext } from "@context";

initContext()

const app = express();

app.use("/", endpoints)

app.use(middlewares.promiseCatcher);

app.listen(config.port, () => {
  console.log(`Listening on port http://0.0.0.0.:${config.port}...`);
});
