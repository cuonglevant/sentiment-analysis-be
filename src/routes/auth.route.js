import express from "express";
import { signup, signin, signout } from "../controllers/auth.controller.js";
import {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
} from "../middlewares/verifySignUp.js";

const router = express.Router();

// Apply verifySignUp middleware to the signup route
router.post(
  "/signup",
  [checkDuplicateUsernameOrEmail, checkRolesExisted],
  signup
);

router.post("/signin", signin);
router.post("/signout", signout);

export default router;
