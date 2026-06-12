const express = require("express");
const router = express.Router();

const extraCateController = require("../controller/extraCateController");
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
router.use(requirePermission("extraCategories:manage"));

router.get("/", (req, res) => {
  res.redirect("/extra-category/view");
});

router.get("/view", extraCateController.extraCategoryList);

router.get("/add", extraCateController.addPage);
router.post("/add", extraCateController.createExtraCategory);

router.get("/edit/:id", extraCateController.editPage);
router.post("/edit/:id", extraCateController.updateExtraCategory);

router.get("/delete/:id", extraCateController.softDelete);

router.get("/trash", extraCateController.trashPage);

router.get("/restore/:id", extraCateController.restoreExtraCategory);

router.get(
  "/permanent-delete/:id",
  extraCateController.permanentDelete
);

module.exports = router;
