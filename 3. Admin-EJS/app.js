const express = require("express");
const path = require("path");
const PORT = 8081;

const app = express();

app.set("view engine", "ejs");
app.set("views", [
    path.join(__dirname, "views", "pages"),
    path.join(__dirname, "views", "partials")
]);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.redirect("/admin");
});

app.get("/admin", (req, res) => {
    res.render("admin");
});

app.get("/typography", (req, res) => {
    res.render("typography");
});

app.get("/color", (req, res) => {
    res.render("color");
});

app.get("/icon", (req, res) => {
    res.render("icon");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/samplePage", (req, res) => {
    res.render("samplePage");
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}/admin`);
    });
}

module.exports = app;
