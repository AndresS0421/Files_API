import express from "express";
import { create_controller } from "../controllers/user/create.controller.js";
import { login_controller } from "../controllers/user/login.controller.js";

const router = express.Router();

router.route("/create")
    .post(create_controller);

router.route("/login")
    .post(login_controller);

export default router;