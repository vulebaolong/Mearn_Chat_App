const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const messageController = require("../controller/messageController");

const messageRouter = express.Router();

messageRouter.post("/", authMiddleware.protect, messageController.sendMessage);
messageRouter.get("/:chatId", authMiddleware.protect, messageController.allMessage);

module.exports = {
    messageRouter,
};
