const express = require("express");
const router = express.Router();

const categoryController = require("../controller/categoryController");
const { requirePermission } = require("../middleware/roleMiddleware");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
    return next();
  }

  req.flash("warning", "Please login first to continue.");
  res.redirect("/login");
};

router.use(isAuth);
router.use(requirePermission("categories:manage"));

router.get("/", (req, res) => {
  res.redirect("/category/view");
});

router.get("/view", categoryController.categoryList);

router.get("/add", categoryController.addPage);
router.post("/add", categoryController.createCategory);

router.get("/edit/:id", categoryController.editPage);
router.post("/edit/:id", categoryController.updateCategory);

router.get("/delete/:id", categoryController.softDelete);

router.get("/trash", categoryController.trashPage);

router.get("/restore/:id", categoryController.restoreCategory);

router.get(
  "/permanent-delete/:id",
  categoryController.permanentDelete
);

module.exports = router;
