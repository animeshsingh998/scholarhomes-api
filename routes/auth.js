import express from "express";
import {
  giveAdmin,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/updateUser/:token",authenticate, updateUser);
router.put("/logout/:token", authenticate, logoutUser);
router.get("/giveAdmin", giveAdmin);

export default router;
