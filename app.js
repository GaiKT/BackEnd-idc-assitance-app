import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./apps/auth.js";
import dotenv from "dotenv";
import aupRouter from "./apps/aup.js";
import companyRouter from "./apps/company.js";
import checklistsRouter from "./apps/checklists.js";

async function init() {
  dotenv.config();
  
  const app = express();
  const port = 4000;

  app.use(bodyParser.json());
  app.use(cors());
  app.use("/auth", authRouter);
  app.use("/aup", aupRouter);
  app.use("/company",companyRouter);
  app.use("/checklists",checklistsRouter);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("*", (req, res) => {
    res.status(404).send("Not found");
  });

  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
}

init();