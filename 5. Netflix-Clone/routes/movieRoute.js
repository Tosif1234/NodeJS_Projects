const express = require("express");

const router = express.Router();

const movieController = require("../controller/movieController");

const upload = require("../config/multer");

router.get("/", (req, res) => {
    res.redirect("/movies/view");
});

router.get("/view/:id", movieController.getSingleMovie);
router.get("/view", movieController.getMovie);
router.get("/add", movieController.getAddMoviePage);

router.post("/add", upload.single('image') ,movieController.addMovie);

router.get("/edit/:id", movieController.getEditMoviePage);
router.post("/edit/:id", upload.single("image"),movieController.editMovie);
router.post("/delete/:id", movieController.deleteMovie);

module.exports = router;
