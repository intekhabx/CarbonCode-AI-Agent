import express, {type Express} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./lib/winston-logger.js";
import { env } from "./config/env.js";
import authRoute from "./modules/auth/auth.route.js";
import globalErrorHandler from "./middleware/error-handler.js";




export default function createApplication(): Express{
  const app = express();

  // middlewares
  app.use(express.json());
  app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }))
  app.use(cookieParser());

  app.use((req, res, next) => {
    logger.info(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    next();
  })


  // routes
  app.use("/api/auth", authRoute);
  

  app.get("/health", (req, res) => {
    res.json({server: "healthy"});
  })


  app.use(globalErrorHandler);

  return app;
}
