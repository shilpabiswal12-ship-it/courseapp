import express from "express";
import { login, logout, signup, getAllUsers } from "../controllers/admin.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";



const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/users", adminMiddleware, getAllUsers);


export default router;