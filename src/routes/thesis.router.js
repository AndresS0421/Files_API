import express from "express";
import { get_by_user_id_controller } from "../controllers/thesis/get_by_user_id.controller.js";
import { get_all_controller } from "../controllers/thesis/get_all.controller.js";
import { get_by_id_controller } from "../controllers/thesis/get_by_id.controller.js";
import { upload_controller } from "../controllers/thesis/upload.controller.js";
import { delete_controller } from "../controllers/thesis/delete.controller.js";
import { update_controller } from "../controllers/thesis/update.controller.js";

const router = express.Router();

router.route("/get-user-id")
    .get(get_by_user_id_controller);

router.route("/get-all")
    .get(get_all_controller);

router.route("/get")
    .get(get_by_id_controller);

router.route("/upload")
    .post(upload_controller);

router.route("/delete")
    .delete(delete_controller);

router.route("/update")
    .put(update_controller);

export default router;