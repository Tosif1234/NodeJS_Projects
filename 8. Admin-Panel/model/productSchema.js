const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },

    extraCategory: {
      type: Schema.Types.ObjectId,
      ref: "ExtraCategory",
      required: true,
    },

    productName: {
      type: String,
      trim: true,
    },

    productImage: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Product", productSchema);
