const express = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.get("/", authMiddleware.protect, userController.searchUser);
userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.login);

module.exports = userRouter;
