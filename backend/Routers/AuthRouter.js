import express from "express";
import {
  loginSuperAdmin,
} from "../Controllers/AuthCtrl.js";

const router = express.Router();

router.post("/login", loginSuperAdmin);

export default router;
