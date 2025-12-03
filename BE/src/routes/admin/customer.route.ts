import express from "express";
import * as customerController from "../../controllers/customer.controller";

const router = express.Router();

// Customer routes
router.get("/", customerController.getAllCustomers);
router.get("/stats", customerController.getCustomerStats);
router.get("/phone/:phone", customerController.getCustomerByPhone);
router.get("/:phone/orders", customerController.getCustomerOrderHistory);
router.patch("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;
