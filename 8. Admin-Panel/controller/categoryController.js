const Category = require("../model/categorySchema");

exports.categoryList = async (req, res) => {
  try {
    const categories = await Category.find({
      isDeleted: false,
    });

    res.render("pages/category/viewCate", {
      activePage: "view-category",
      categories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load categories.");
    res.redirect("/");
  }
};

exports.addPage = async (req, res) => {
  try {
    res.render("pages/category/addCate", {
      activePage: "add-category",
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open category form.");
    res.redirect("/");
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { category } = req.body;

    const existingCategory = await Category.findOne({
      category,
      isDeleted: false,
    });

    if (existingCategory) {
      req.flash("error", "Category already exists.");
      return res.redirect("/category/add");
    }

    await Category.create({
      category,
      isActive: req.body.isActive ? true : false,
    });

    req.flash("success", "Category created successfully.");
    res.redirect("/category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to create category. Please try again.");
    res.redirect("/category/add");
  }
};

exports.editPage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      req.flash("error", "Category not found.");
      return res.redirect("/category/view");
    }

    res.render("pages/category/editCate", {
      activePage: "view-category",
      category,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open category for editing.");
    res.redirect("/category/view");
  }
};

exports.updateCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, {
      category: req.body.category,
      isActive: req.body.isActive ? true : false,
    });

    req.flash("success", "Category updated successfully.");
    res.redirect("/category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to update category. Please try again.");
    res.redirect("/category/view");
  }
};

exports.softDelete = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    if (!category) {
      req.flash("error", "Category not found or already archived.");
      return res.redirect("/category/view");
    }

    req.flash("success", "Category moved to archive.");
    res.redirect("/category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to archive category. Please try again.");
    res.redirect("/category/view");
  }
};

exports.trashPage = async (req, res) => {
  try {
    const categories = await Category.find({
      isDeleted: true,
    });

    res.render("pages/category/trashCate", {
      activePage: "trash-category",
      categories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load archived categories.");
    res.redirect("/category/view");
  }
};

exports.restoreCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    if (!category) {
      req.flash("error", "Archived category not found.");
      return res.redirect("/category/trash");
    }

    req.flash("success", "Category restored successfully.");
    res.redirect("/category/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to restore category. Please try again.");
    res.redirect("/category/trash");
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      req.flash("error", "Category not found or already deleted.");
      return res.redirect("/category/trash");
    }

    req.flash("success", "Category permanently deleted.");
    res.redirect("/category/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to delete category. Please try again.");
    res.redirect("/category/trash");
  }
};
