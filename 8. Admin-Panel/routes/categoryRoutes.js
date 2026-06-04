const express = require("express")
const router = express.Router();

router.get("/category/add", (req, res) => {
    res.render("pages/add-category");
})

module.exports = router;