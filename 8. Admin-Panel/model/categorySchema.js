const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    category: {
      type: String,
      required: true,
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

module.exports = model("Category", categorySchema);