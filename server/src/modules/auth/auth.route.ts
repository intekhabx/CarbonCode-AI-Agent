import express, { Router } from "express";
import * as controller from "./auth.controller.js";
import { isLoggedIn } from "./auth.middleware.js";


const router: Router = express.Router();


router.post("/signup", controller.signupUserWithEmailAndPassword);

router.post("/signin", controller.signinUserWithEmailAndPassword);

router.post("/renew/token", controller.renewAccessTokenAndRefreshToken);

router.post("/signout", controller.signoutUser);

router.get("/profile", isLoggedIn, controller.getLoggedInUserInfo);



export default router;
