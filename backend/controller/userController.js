const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const createToken = require("../config/createToken");

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Xin vui lòng nhập tất cả các trường");
    }

    const userExits = await User.findOne({ email });

    if (userExits) {
        res.status(400);
        throw new Error("User đã tồn tại");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).send({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: createToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error("Tạo người dùng mới thất bại");
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        const isPassword = await user.matchPassword(password);
        if (user && isPassword) {
            res.status(201).send({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: createToken(user._id),
            });
            console.log(`đăng nhập tk ${user.name} thành công`);
        } else {
            res.status(400);
            throw new Error("Email hoặc mật khẩu chưa đúng");
        }
    } catch (error) {
        res.status(400);
        throw new Error("Email hoặc mật khẩu chưa đúng");
    }
});

const searchUser = asyncHandler(async (req, res) => {
    const keyWord = req.query.search
        ? {
              $or: [
                  { name: new RegExp(req.query.search, "i") },
                  { email: new RegExp(req.query.search, "i") },
              ],
          }
        : {};
    const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } });
    //.find({ _id: { $ne: req.user._id } })
    res.status(200).send(users);
});

module.exports = {
    registerUser,
    login,
    searchUser,
};
