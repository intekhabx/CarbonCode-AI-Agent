import express, {type Router} from "express";
import * as controller from "./chat.controller.js";
import { isLoggedIn } from "../auth/auth.middleware.js";
import validateInput from "../../middleware/validation-handler.js";
import { callChatAgentInputSchemaDto } from "./chat.dto.js";

const router: Router = express.Router();

router.post("/chat", isLoggedIn, validateInput(callChatAgentInputSchemaDto), controller.callChatAgent);

router.get("/chat", isLoggedIn, controller.getAllUserChats);

router.get("/chat/:chatId", isLoggedIn, controller.getUserChatById);

router.patch("/chat/pin/:chatId", isLoggedIn, controller.togglePinnedUserChat);

router.delete("/chat/:chatId", isLoggedIn, controller.deleteUserChatById);


export default router;
