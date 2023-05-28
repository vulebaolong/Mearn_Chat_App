const mongoose = require("mongoose");

const userModel = mongoose.Schema(
    {
        name: { type: String, require: true },
        email: { type: String, requie: true },
        password: { type: String, requie: true },
        pic: {
            type: String,
            requie: true,
            default:
                "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
