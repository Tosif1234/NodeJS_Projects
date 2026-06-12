const Category = require("../model/categorySchema");
const Subcategory = require("../model/subcateSchema");
const ExtraCategory = require("../model/extraCateSchema");

const getActiveCategories = () => Category.find({
  isActive: true,
  isDeleted: false,
}).sort({ category: 1 });

const getActiveSubcategories = () => Subcategory.find({
  isActive: true,
  isDeleted: false,
}).populate("category").sort({ subcategory: 1 });

const validateActivePath = async ({ category, subcategory }) => {
  const activeCategory = await Category.findOne({
    _id: category,
    isActive: true,
    isDeleted: false,
  });

  if (!activeCategory) {
    return false;
  }

  const activeSubcategory = await Subcategory.findOne({
    _id: subcategory,
    category,
    isActive: true,
    isDeleted: false,
  });

  return !!activeSubcategory;
};

exports.extraCategoryList = async (req, res) => {
  try {
    const extraCategories = await ExtraCategory.find({
      isDeleted: false,
    }).populate("category").populate("subcategory").sort({ createdAt: -1 });

    res.render("pages/extraCategory/viewExtraCate", {
      activePage: "view-extra-category",
      extraCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load extra categories.");
    res.redirect("/");
  }
};

exports.addPage = async (req, res) => {
  try {
    const categories = await getActiveCategories();
    const subcategories = await getActiveSubcategories();

    res.render("pages/extraCategory/addExtraCate", {
      activePage: "add-extra-category",
      categories,
      subcategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open extra category form.");
    res.redirect("/extra-category/view");
  }
};

exports.createExtraCategory = async (req, res) => {
  try {
    const { category, subcategory, extraCategory } = req.body;

    if (!category || !subcategory || !extraCategory) {
      req.flash("error", "Please select category, subcategory, and enter an extra category name.");
      return res.redirect("/extra-category/add");
    }

    if (!(await validateActivePath({ category, subcategory }))) {
      req.flash("error", "Please select an active category and active subcategory.");
      return res.redirect("/extra-category/add");
    }

    const existingExtraCategory = await ExtraCategory.findOne({
      category,
      subcategory,
      extraCategory,
      isDeleted: false,
    });

    if (existingExtraCategory) {
      req.flash("error", "Extra category already exists for this subcategory.");
      return res.redirect("/extra-category/add");
    }

    await ExtraCategory.create({
      category,
      subcategory,
      extraCategory,
      isActive: req.body.isActive ? true : false,
    });

    req.flash("success", "Extra category created successfully.");
    res.redirect("/extra-category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to create extra category. Please try again.");
    res.redirect("/extra-category/add");
  }
};

exports.editPage = async (req, res) => {
  try {
    const extraCategory = await ExtraCategory.findById(req.params.id)
      .populate("category")
      .populate("subcategory");
    const categories = await getActiveCategories();
    const subcategories = await getActiveSubcategories();

    if (!extraCategory) {
      req.flash("error", "Extra category not found.");
      return res.redirect("/extra-category/view");
    }

    res.render("pages/extraCategory/editExtraCate", {
      activePage: "view-extra-category",
      extraCategory,
      categories,
      subcategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open extra category for editing.");
    res.redirect("/extra-category/view");
  }
};

exports.updateExtraCategory = async (req, res) => {
  try {
    const { category, subcategory, extraCategory } = req.body;

    if (!category || !subcategory || !extraCategory) {
      req.flash("error", "Please select category, subcategory, and enter an extra category name.");
      return res.redirect(`/extra-category/edit/${req.params.id}`);
    }

    if (!(await validateActivePath({ category, subcategory }))) {
      req.flash("error", "Please select an active category and active subcategory.");
      return res.redirect(`/extra-category/edit/${req.params.id}`);
    }

    const duplicateExtraCategory = await ExtraCategory.findOne({
      _id: { $ne: req.params.id },
      category,
      subcategory,
      extraCategory,
      isDeleted: false,
    });

    if (duplicateExtraCategory) {
      req.flash("error", "Extra category already exists for this subcategory.");
      return res.redirect(`/extra-category/edit/${req.params.id}`);
    }

    const updatedExtraCategory = await ExtraCategory.findByIdAndUpdate(req.params.id, {
      category,
      subcategory,
      extraCategory,
      isActive: req.body.isActive ? true : false,
    });

    if (!updatedExtraCategory) {
      req.flash("error", "Extra category not found.");
      return res.redirect("/extra-category/view");
    }

    req.flash("success", "Extra category updated successfully.");
    res.redirect("/extra-category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to update extra category. Please try again.");
    res.redirect("/extra-category/view");
  }
};

exports.softDelete = async (req, res) => {
  try {
    const extraCategory = await ExtraCategory.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    if (!extraCategory) {
      req.flash("error", "Extra category not found or already archived.");
      return res.redirect("/extra-category/view");
    }

    req.flash("success", "Extra category moved to archive.");
    res.redirect("/extra-category/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to archive extra category. Please try again.");
    res.redirect("/extra-category/view");
  }
};

exports.trashPage = async (req, res) => {
  try {
    const extraCategories = await ExtraCategory.find({
      isDeleted: true,
    }).populate("category").populate("subcategory").sort({ updatedAt: -1 });

    res.render("pages/extraCategory/trashExtraCate", {
      activePage: "trash-extra-category",
      extraCategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load archived extra categories.");
    res.redirect("/extra-category/view");
  }
};

exports.restoreExtraCategory = async (req, res) => {
  try {
    const extraCategory = await ExtraCategory.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    if (!extraCategory) {
      req.flash("error", "Archived extra category not found.");
      return res.redirect("/extra-category/trash");
    }

    req.flash("success", "Extra category restored successfully.");
    res.redirect("/extra-category/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to restore extra category. Please try again.");
    res.redirect("/extra-category/trash");
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    const extraCategory = await ExtraCategory.findByIdAndDelete(req.params.id);

    if (!extraCategory) {
      req.flash("error", "Extra category not found or already deleted.");
      return res.redirect("/extra-category/trash");
    }

    req.flash("success", "Extra category permanently deleted.");
    res.redirect("/extra-category/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to delete extra category. Please try again.");
    res.redirect("/extra-category/trash");
  }
};
