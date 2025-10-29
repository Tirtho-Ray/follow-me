import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";


const router = express.Router();

// Influencer
router.post("/", auth(USER_ROLE.INFLUENCER), OrderController.createOrder);

// Admin routes
router.get("/", auth(USER_ROLE.ADMIN , USER_ROLE.INFLUENCER), OrderController.getAllOrders);
router.get("/:id", auth(USER_ROLE.ADMIN , USER_ROLE.INFLUENCER), OrderController.getOrderById);
router.patch("/:id/status", auth(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN), OrderController.updateOrderStatus);
router.delete("/:id/soft", auth(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN), OrderController.softDeleteOrder);
router.delete("/:id/hard", auth(USER_ROLE.ADMIN,USER_ROLE.SUPER_ADMIN), OrderController.hardDeleteOrder);

// Viewer routes
router.get("/viewer/all", auth(USER_ROLE.WORKER), OrderController.getAllOrdersForViewerController);
router.get("/viewer/:id", auth(USER_ROLE.WORKER), OrderController.getOrderByIdForViewerController);

export const OrderRoutes = router;
