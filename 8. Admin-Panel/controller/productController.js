const Category = require("../model/categorySchema");
const Subcategory = require("../model/subcateSchema");
const ExtraCategory = require("../model/extraCateSchema");
const Product = require("../model/productSchema");

const getCatalogOptions = async () => {
  const [categories, subcategories, extraCategories] = await Promise.all([
    Category.find({ isActive: true, isDeleted: false }).sort({ category: 1 }),
    Subcategory.find({ isActive: true, isDeleted: false }).populate("category").sort({ subcategory: 1 }),
    ExtraCategory.find({ isActive: true, isDeleted: false }).populate("category").populate("subcategory").sort({ extraCategory: 1 }),
  ]);

  return { categories, subcategories, extraCategories };
};

const validateCatalogPath = async ({ category, subcategory, extraCategory }) => {
  const selectedCategory = await Category.findOne({
    _id: category,
    isActive: true,
    isDeleted: false,
  });

  if (!selectedCategory) {
    return false;
  }

  const selectedSubcategory = await Subcategory.findOne({
    _id: subcategory,
    category,
    isActive: true,
    isDeleted: false,
  });

  if (!selectedSubcategory) {
    return false;
  }

  const selectedExtraCategory = await ExtraCategory.findOne({
    _id: extraCategory,
    category,
    subcategory,
    isActive: true,
    isDeleted: false,
  });

  return !!selectedExtraCategory;
};

exports.productList = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: false,
    })
      .populate("category")
      .populate("subcategory")
      .populate("extraCategory")
      .sort({ createdAt: -1 });

    res.render("pages/product/viewProduct", {
      activePage: "view-products",
      products,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load products.");
    res.redirect("/");
  }
};

exports.addPage = async (req, res) => {
  try {
    const options = await getCatalogOptions();

    res.render("pages/product/addProduct", {
      activePage: "add-product",
      ...options,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open product form.");
    res.redirect("/products/view");
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { category, subcategory, extraCategory, price } = req.body;
    const productPrice = Number(price);

    if (!category || !subcategory || !extraCategory || Number.isNaN(productPrice) || productPrice < 0 || !req.file) {
      req.flash("error", "Please select all categories, upload a product image, and add a valid price.");
      return res.redirect("/products/add");
    }

    const isValidPath = await validateCatalogPath({ category, subcategory, extraCategory });

    if (!isValidPath) {
      req.flash("error", "Selected category path is invalid.");
      return res.redirect("/products/add");
    }

    await Product.create({
      category,
      subcategory,
      extraCategory,
      productImage: req.file ? req.file.filename : "",
      price: productPrice,
      isActive: req.body.isActive ? true : false,
    });

    req.flash("success", "Product created successfully.");
    res.redirect("/products/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to create product. Please try again.");
    res.redirect("/products/add");
  }
};

exports.editPage = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    })
      .populate("category")
      .populate("subcategory")
      .populate("extraCategory");
    const options = await getCatalogOptions();

    if (!product) {
      req.flash("error", "Product not found.");
      return res.redirect("/products/view");
    }

    res.render("pages/product/editProduct", {
      activePage: "view-products",
      product,
      ...options,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to open product for editing.");
    res.redirect("/products/view");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { category, subcategory, extraCategory, productName, price } = req.body;
    const productPrice = Number(price);

    if (!category || !subcategory || !extraCategory || Number.isNaN(productPrice) || productPrice < 0) {
      req.flash("error", "Please select all categories and add a valid price.");
      return res.redirect(`/products/edit/${req.params.id}`);
    }

    const isValidPath = await validateCatalogPath({ category, subcategory, extraCategory });

    if (!isValidPath) {
      req.flash("error", "Selected category path is invalid.");
      return res.redirect(`/products/edit/${req.params.id}`);
    }

    const duplicateProduct = await Product.findOne({
      _id: { $ne: req.params.id },
      category,
      subcategory,
      extraCategory,
      productName: productName || "",
      isDeleted: false,
    });

    if (duplicateProduct) {
      req.flash("error", "Product already exists in this category path.");
      return res.redirect(`/products/edit/${req.params.id}`);
    }

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        isDeleted: false,
      },
      {
        category,
        subcategory,
        extraCategory,
        productName: productName || "",
        price: productPrice,
        isActive: req.body.isActive ? true : false,
      }
    );

    if (!updatedProduct) {
      req.flash("error", "Product not found.");
      return res.redirect("/products/view");
    }

    req.flash("success", "Product updated successfully.");
    res.redirect("/products/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to update product. Please try again.");
    res.redirect("/products/view");
  }
};

exports.softDelete = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    if (!product) {
      req.flash("error", "Product not found or already archived.");
      return res.redirect("/products/view");
    }

    req.flash("success", "Product moved to archive.");
    res.redirect("/products/view");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to archive product. Please try again.");
    res.redirect("/products/view");
  }
};

exports.trashPage = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: true,
    })
      .populate("category")
      .populate("subcategory")
      .populate("extraCategory")
      .sort({ updatedAt: -1 });

    res.render("pages/product/trashProduct", {
      activePage: "trash-products",
      products,
    });
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to load archived products.");
    res.redirect("/products/view");
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
    });

    if (!product) {
      req.flash("error", "Archived product not found.");
      return res.redirect("/products/trash");
    }

    req.flash("success", "Product restored successfully.");
    res.redirect("/products/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to restore product. Please try again.");
    res.redirect("/products/trash");
  }
};

exports.permanentDelete = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      req.flash("error", "Product not found or already deleted.");
      return res.redirect("/products/trash");
    }

    req.flash("success", "Product permanently deleted.");
    res.redirect("/products/trash");
  } catch (error) {
    console.log(error);
    req.flash("error", "Unable to delete product. Please try again.");
    res.redirect("/products/trash");
  }
};
