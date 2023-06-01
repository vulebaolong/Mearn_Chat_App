const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const chatController = require("../controller/chatController");

const chatRouter = express.Router();
chatRouter.post("/", authMiddleware.protect, chatController.accessChat);
chatRouter.get("/", authMiddleware.protect, chatController.fectChats);
chatRouter.post("/creategroup", authMiddleware.protect, chatController.createGroupChat);
chatRouter.put("/renamegroup", authMiddleware.protect, chatController.renameGroupChat);
chatRouter.put("/addgroup", authMiddleware.protect, chatController.addToGroupChat);
chatRouter.put(
    "/deleteusergroup",
    authMiddleware.protect,
    chatController.deleteUserGroup
);

module.exports = chatRouter;
