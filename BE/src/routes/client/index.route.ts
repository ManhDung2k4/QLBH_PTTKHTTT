import { getAllProducts, getProductById } from "../../controllers/product.controller";
import { login } from "../../controllers/user.controller";
import express from "express";
const router = express.Router();

router.post("/login", login);
router.get("/products", getAllProducts)
router.get("/products/:id", getProductById)
export default router;
