const mongoose = require("mongoose");

const connectDB = async() =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/MoviesDB");
        console.log("Database Connected..")
    } catch (error) {
       console.log(error); 
    }
}

module.exports = connectDB;