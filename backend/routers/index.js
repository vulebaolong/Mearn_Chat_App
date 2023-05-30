const express = require("express");
const userRouter = require("./userRouter");
const chatRouter = require("./chatRouter");

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/chat", chatRouter);

module.exports = rootRouter;
