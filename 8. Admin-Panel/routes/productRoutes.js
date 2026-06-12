const express = require("express");
const multer = require("multer");
const router = express.Router();

const productController = require("../controller/productController");
const { requirePermission } = require("../middleware/roleMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed."));
    }

    cb(null, true);
  },
});

const uploadProductImage = (req, res, next) => {
  upload.single("productImage")(req, res, (error) => {
    if (error) {
      req.flash("error", error.message || "Unable to upload product image.");
      return res.redirect("/products/add");
    }

    next();
  });
};

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.currentUser = req.user;
    return next();
  }

  req.flash("warning", "Please login first to continue.");
  res.redirect("/login");
};

router.use(isAuth);

router.get("/", (req, res) => {
  res.redirect("/products/view");
});

router.get("/view", requirePermission("products:view"), productController.productList);

router.get("/add", requirePermission("products:create"), productController.addPage);
router.post("/add", requirePermission("products:create"), uploadProductImage, productController.createProduct);

router.get("/edit/:id", requirePermission("products:edit"), productController.editPage);
router.post("/edit/:id", requirePermission("products:edit"), productController.updateProduct);

router.get("/delete/:id", requirePermission("products:delete"), productController.softDelete);

router.get("/trash", requirePermission("products:trash"), productController.trashPage);

router.get("/restore/:id", requirePermission("products:restore"), productController.restoreProduct);

router.get(
  "/permanent-delete/:id",
  requirePermission("products:delete"),
  productController.permanentDelete
);

module.exports = router;
