const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("không có ID");
        return res.sendStatus(400);
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const fullChat = await Chat.findOne({
                _id: createdChat._id,
            }).populate("users", "-password");

            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fectChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({
                updateAt: -1,
            })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(result);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Xin vui lòng nhập đầy đủ các trường" });
    }

    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
        return res
            .status(400)
            .send({ message: "Cần có tối thiểu 2 người để tạo nhóm chat" });
    }

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroupChat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updateChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updateChat) {
        res.status(404);
        throw new Error("Không tìm thấy chat");
    }

    res.status(200).send(updateChat);
});

const addToGroupChat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {
                users: userId,
            },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Không tìm thấy chat");
    }

    res.status(200).send(added);
});

const deleteUserGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    const deleteG = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {
                users: userId,
            },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!deleteG) {
        res.status(404);
        throw new Error("Không tìm thấy chat");
    }

    res.status(200).send(deleteG);
});

module.exports = {
    accessChat,
    fectChats,
    createGroupChat,
    renameGroupChat,
    addToGroupChat,
    deleteUserGroup,
};
