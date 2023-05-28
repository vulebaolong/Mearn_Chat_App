const express = require("express");
const dotenv = require("dotenv");
const chats = require("./data/data");

const app = express();
dotenv.config();

app.get("/api/chats", (req, res) => {
    res.status(200).send(chats);
});

// lắng nghe
const port = process.env.PORT || 3002;
app.listen(port, async () => {
    console.log(`Lắng nghe cổng http://localhost:${port} ...`);
});
