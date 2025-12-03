import express from "express";
import * as orderController from "../../controllers/order.controller";

const router = express.Router();

// Order routes
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/stats", orderController.getOrderStats);
router.get("/best-selling", orderController.getBestSellingProducts);
router.get("/revenue", orderController.getRevenueByPeriod);
router.get("/:id", orderController.getOrderById);
router.patch("/:id/status", orderController.updateOrderStatus);
router.post("/:id/cancel", orderController.cancelOrder);

export default router;
