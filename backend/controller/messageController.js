const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    console.log("👙  { content, chatId } : ", { content, chatId });

    if (!content || !chatId) {
        console.log("không có data gửi lên");
        return res.sendStatus(400);
    }

    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const allMessage = asyncHandler(async (req, res) => {
    const { chatId } = req.params;
    try {
        const message = await Message.find({ chat: chatId }).populate(
            "sender",
            "name pic email"
        );
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = {
    sendMessage,
    allMessage,
};
