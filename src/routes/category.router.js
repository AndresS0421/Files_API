import express from "express";
import { create_controller } from "../controllers/category/create.controller.js";
import { get_all_controller } from "../controllers/category/get_all.controller.js";
import { delete_controller } from "../controllers/category/delete.controller.js";
import { update_controller } from "../controllers/category/update.controller.js";

const router = express.Router();

router.route('/create')
    .post(create_controller);

router.route('/get-all')
    .get(get_all_controller);

router.route('/delete')
    .delete(delete_controller);

router.route('/update')
    .put(update_controller);

export default router;