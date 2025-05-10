import express from "express";
import pino from "pino-http";
import cors from "cors";

import contactsRouter from "./routers/contacts.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

// Define server port
const PORT = Number(getEnvVar("PORT", "3000"));

/**
 * Starting server
 */
export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino());

  app.get("/", (req, res) => {
    res.json({
      message: "Hello World!",
    });
  });

  app.use("/contacts", contactsRouter);
  app.use("*", notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
