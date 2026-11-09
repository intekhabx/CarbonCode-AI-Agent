import express, { Router } from "express";
import * as controller from "./auth.controller.js";
import { isLoggedIn } from "./auth.middleware.js";
import validateInput from "../../middleware/validation-handler.js";
import { signinUserInputSchemaDto, signupUserInputSchemaDto } from "./auth.dto.js";


const router: Router = express.Router();


router.post("/signup", validateInput(signupUserInputSchemaDto), controller.signupUserWithEmailAndPassword);

router.post("/signin", validateInput(signinUserInputSchemaDto), controller.signinUserWithEmailAndPassword);

router.post("/renew/token", controller.renewAccessTokenAndRefreshToken);

router.post("/signout", controller.signoutUser);

router.get("/profile", isLoggedIn, controller.getLoggedInUserInfo);



export default router;
