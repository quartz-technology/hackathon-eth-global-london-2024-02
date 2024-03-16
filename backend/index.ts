import express from "express";

import config from "./config"

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.port, () => {
  console.log(`Listening on port http://0.0.0.0.:${config.port}...`);
});
