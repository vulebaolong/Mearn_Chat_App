const express = require("express");
const userRouter = require("./userRouter");
const chatRouter = require("./chatRouter");
const { messageRouter } = require("./messageRouter");

const rootRouter = express.Router();

rootRouter.use("/user", userRouter);
rootRouter.use("/chat", chatRouter);
rootRouter.use("/message", messageRouter);

module.exports = rootRouter;
