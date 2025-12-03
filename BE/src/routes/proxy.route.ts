import { Router } from "express";
import * as proxyController from "../controllers/proxy.controller";

const router = Router();

router.get("/image", proxyController.proxyImage);

export default router;
