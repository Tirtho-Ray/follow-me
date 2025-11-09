import express from "express";
import { OrderController } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

/* -------------------- INFLUENCER ROUTES -------------------- */
router.post(
  "/create-order",
  auth(USER_ROLE.INFLUENCER),
  OrderController.createOrder
);

router.get(
  "/my-orders",
  auth(USER_ROLE.INFLUENCER),
  OrderController.getMyOrders
);

// all open routes
router.get(
  "/all-post",
  OrderController.getApprovedOrdersForViewer
);

router.get(
  "/all-post/:id",
  OrderController.getApprovedOrderByIdForViewer
);

/* -------------------- ADMIN ROUTES -------------------- */
router.get(
  "/all-orders",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.getAllOrders
);

router.get(
  "/all-orders/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.getOrderById
);

router.patch(
  "/:id/status",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.updateOrderStatus
);

router.delete(
  "/:id/soft",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.softDeleteOrder
);

router.delete(
  "/:id/hard",
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  OrderController.hardDeleteOrder
);



export const OrderRoutes = router;
