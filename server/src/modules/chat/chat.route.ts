import express, {type Router} from "express";
import * as controller from "./chat.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";

const router: Router = express.Router();

router.post("/chat", isLoggedIn, controller.callChatAgent);

router.get("/chat", isLoggedIn, controller.getAllUserChats);

router.get("/chat/:chatId", isLoggedIn, controller.getUserChatById);


export default router;
