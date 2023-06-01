const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const rootRouter = require("./routers");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const socketio = require("socket.io");
const path = require("path");

connectDB();
const app = express();

// cài ứng dụng sử dung json
app.use(express.json());

// app.get("/", (req, res) => {
//     res.status(200).send(chats);
// });

app.use("/api/v1", rootRouter);
app.use(notFound);
app.use(errorHandler);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}

// --------------------------deployment------------------------------

// lắng nghe
const port = process.env.PORT || 3002;
const server = app.listen(port, async () => {
    console.log(`Lắng nghe cổng http://localhost:${port} ...`.yellow.bold);
});

const io = socketio(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log(`Kết nối thành công socket.io`.yellow.bold);

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user join room: " + room);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageRecived) => {
        const chat = newMessageRecived.chat;
        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
            if (user._id == newMessageRecived.sender._id) return;
            socket.in(user._id).emit("message recived", newMessageRecived);
        });
    });

    socket.off("setup", () => {
        console.log("user disconnec");
        socket.leave(userData._id);
    });
});
