const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const chats = require("./data/data");
const connectDB = require("./config/db");
const colors = require("colors");
const rootRouter = require("./routers");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

connectDB();
const app = express();

// cài ứng dụng sử dung json
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send(chats);
});

app.use("/api/v1", rootRouter);
app.use(notFound);
app.use(errorHandler);

// lắng nghe
const port = process.env.PORT || 3002;
app.listen(port, async () => {
    console.log(`Lắng nghe cổng http://localhost:${port} ...`.yellow.bold);
});
