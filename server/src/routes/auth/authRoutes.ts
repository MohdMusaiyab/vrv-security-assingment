import express from "express";
import {
  loginController,
  refreshController,
  registerController,
} from "../../controllers/authControllers";

const authRoutes = express.Router();

authRoutes.post("/register", registerController);

authRoutes.post("/login", loginController);

authRoutes.post("/refresh-token", refreshController);

export default authRoutes;
