const mongoose = require('mongoose');

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017/adminDB");
        console.log("Database Connected ...");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDB;
