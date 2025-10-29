import express from "express";
import { TaskController } from "./task.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

router.post("/create-task",auth(USER_ROLE.WORKER), TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.patch("/update-proof-status/:taskId",auth(USER_ROLE.ADMIN), TaskController.updateProofStatus);

//worker
router.get("/my-tasks", auth(USER_ROLE.WORKER), TaskController.getMyTasks);

router.get("/:id", TaskController.getSingleTask);

export const TaskRoutes = router;
