import {
  createProduct,
  deleteProduct,
  updateProduct,
  importPhoneData,
  getLowStockProducts,
} from "../../controllers/product.controller";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  changePassword,
  deleteUser,
} from "../../controllers/user.controller";
import express from "express";
import orderRoutes from "./order.route";
import customerRoutes from "./customer.route";

const router = express.Router();

// Product routes
router.post("/products/new", createProduct);
router.patch("/products/edit", updateProduct);
router.delete("/products/delete/:id", deleteProduct);
router.post("/products/import", importPhoneData);
router.get("/products/low-stock", getLowStockProducts);

// Order routes
router.use("/orders", orderRoutes);

// Customer routes
router.use("/customers", customerRoutes);

// User routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.patch("/users/:id/password", changePassword);
router.delete("/users/:id", deleteUser);

export default router;
