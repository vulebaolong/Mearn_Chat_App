const mongoose = require("mongoose");

// tạo string đường dẫn kết nối với atlas
const DB = process.env.MONGO_URI.replace("<PASSWORD>", process.env.MONGO_PASSWORD);

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            `MongooDB đã kết nối thành công: ${connect.connection.host}`.yellow.bold
        );
    } catch (error) {
        console.log(`👙  error: ${error}`.red.bold);
        process.exit();
    }
};

module.exports = connectDB;
