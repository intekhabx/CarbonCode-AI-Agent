import express, {type Express} from "express";
import cors from "cors";
import logger from "./lib/winston-logger.js";
import { env } from "./config/env.js";




export default function createApplication(): Express{
  const app = express();

  // middlewares
  app.use(express.json());
  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }))

  app.use((req, res, next) => {
    logger.info(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
  })


  // routes

  app.get("/health", (req, res) => {
    res.json({server: "healthy"});
  })

  return app;
}
