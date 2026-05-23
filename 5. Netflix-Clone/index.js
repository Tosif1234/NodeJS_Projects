const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const router = require("./routes/movieRoute");
const movieController = require("./controller/movieController");


const app = express();
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", movieController.getHomePage);
app.use("/movies", router);

const port = 8081;

connectDB();

app.listen(port , (req, res)=>{
    console.log(`Server running on http://localhost:${port}`)
})
