const express = require("express");
const router = express.Router();

const subcateController = require("../controller/subcateController");
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
router.use(requirePermission("subcategories:manage"));

router.get("/", (req, res) => {
  res.redirect("/subcategory/view");
});

router.get("/view", subcateController.subcategoryList);

router.get("/add", subcateController.addPage);
router.post("/add", subcateController.createSubcategory);

router.get("/edit/:id", subcateController.editPage);
router.post("/edit/:id", subcateController.updateSubcategory);

router.get("/delete/:id", subcateController.softDelete);

router.get("/trash", subcateController.trashPage);

router.get("/restore/:id", subcateController.restoreSubcategory);

router.get(
  "/permanent-delete/:id",
  subcateController.permanentDelete
);

module.exports = router;
