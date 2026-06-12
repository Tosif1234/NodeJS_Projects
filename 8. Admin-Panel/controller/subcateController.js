const Category = require("../model/categorySchema");
const Subcategory = require("../model/subcateSchema");

const getActiveCategories = () => Category.find({
  isActive: true,
  isDeleted: false,
}).sort({ category: 1 });

const isActiveCategory = async (categoryId) => {
  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
    isDeleted: false,
  });

  return !!category;
};

exports.subcategoryList = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      isDeleted: false,
    }).populate("category").sort({ createdAt: -1 });

    res.render("pages/subcategory/viewSubcate", {
      activePage: "view-subcategory",
      subcategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load subcategories.");
    res.redirect("/");
  }
};

exports.addPage = async (req, res) => {
  try {
    const categories = await getActiveCategories();

    res.render("pages/subcategory/addSubcate", {
      activePage: "add-subcategory",
      categories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open subcategory form.");
    res.redirect("/subcategory/view");
  }
};

exports.createSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.body;

    if (!category || !subcategory) {
      req.flash("error", "Please select a category and enter a subcategory name.");
      return res.redirect("/subcategory/add");
    }

    if (!(await isActiveCategory(category))) {
      req.flash("error", "Please select an active category.");
      return res.redirect("/subcategory/add");
    }

    const existingSubcategory = await Subcategory.findOne({
      category,
      subcategory,
      isDeleted: false,
    });

    if (existingSubcategory) {
      req.flash("error", "Subcategory already exists for this category.");
      return res.redirect("/subcategory/add");
    }

    await Subcategory.create({
      category,
      subcategory,
      isActive: req.body.isActive ? true : false,
    });

    req.flash("success", "Subcategory created successfully.");
    res.redirect("/subcategory/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to create subcategory. Please try again.");
    res.redirect("/subcategory/add");
  }
};

exports.editPage = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id).populate("category");
    const categories = await getActiveCategories();

    if (!subcategory) {
      req.flash("error", "Subcategory not found.");
      return res.redirect("/subcategory/view");
    }

    res.render("pages/subcategory/editSubcate", {
      activePage: "view-subcategory",
      subcategory,
      categories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open subcategory for editing.");
    res.redirect("/subcategory/view");
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { category, subcategory } = req.body;

    if (!category || !subcategory) {
      req.flash("error", "Please select a category and enter a subcategory name.");
      return res.redirect(`/subcategory/edit/${req.params.id}`);
    }

    if (!(await isActiveCategory(category))) {
      req.flash("error", "Please select an active category.");
      return res.redirect(`/subcategory/edit/${req.params.id}`);
    }

    const duplicateSubcategory = await Subcategory.findOne({
      _id: { $ne: req.params.id },
      category,
      subcategory,
      isDeleted: false,
    });

    if (duplicateSubcategory) {
      req.flash("error", "Subcategory already exists for this category.");
      return res.redirect(`/subcategory/edit/${req.params.id}`);
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(req.params.id, {
      category,
      subcategory,
      isActive: req.body.isActive ? true : false,
    });

    if (!updatedSubcategory) {
      req.flash("error", "Subcategory not found.");
      return res.redirect("/subcategory/view");
    }

    req.flash("success", "Subcategory updated successfully.");
    res.redirect("/subcategory/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to update subcategory. Please try again.");
    res.redirect("/subcategory/view");
  }
};

exports.softDelete = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    if (!subcategory) {
      req.flash("error", "Subcategory not found or already archived.");
      return res.redirect("/subcategory/view");
    }

    req.flash("success", "Subcategory moved to archive.");
    res.redirect("/subcategory/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to archive subcategory. Please try again.");
    res.redirect("/subcategory/view");
  }
};

exports.trashPage = async (req, res) => {
  try {
    const subcategories = await Subcategory.find({
      isDeleted: true,
    }).populate("category").sort({ updatedAt: -1 });

    res.render("pages/subcategory/trashSubcate", {
      activePage: "trash-subcategory",
      subcategories,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load archived subcategories.");
    res.redirect("/subcategory/view");
  }
};

exports.restoreSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    if (!subcategory) {
      req.flash("error", "Archived subcategory not found.");
      return res.redirect("/subcategory/trash");
    }

    req.flash("success", "Subcategory restored successfully.");
    res.redirect("/subcategory/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to restore subcategory. Please try again.");
    res.redirect("/subcategory/trash");
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByIdAndDelete(req.params.id);

    if (!subcategory) {
      req.flash("error", "Subcategory not found or already deleted.");
      return res.redirect("/subcategory/trash");
    }

    req.flash("success", "Subcategory permanently deleted.");
    res.redirect("/subcategory/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to delete subcategory. Please try again.");
    res.redirect("/subcategory/trash");
  }
};
