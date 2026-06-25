import mongoose from 'mongoose';

const softDeletePlugin = (schema) => {
  schema.add({
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  });

  const excludeDeleted = function (next) {
    if (this.getFilter().isDeleted !== undefined) {
      return next();
    }
    this.where({ isDeleted: { $ne: true } });
    next();
  };

  schema.pre('find', excludeDeleted);
  schema.pre('findOne', excludeDeleted);
  schema.pre('findOneAndUpdate', excludeDeleted);
  schema.pre('countDocuments', excludeDeleted);
  schema.pre('estimatedDocumentCount', excludeDeleted);

  schema.methods.softDelete = async function (deletedByUserId) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    if (deletedByUserId) {
      this.updatedBy = deletedByUserId;
    }
    return this.save();
  };
};

export default softDeletePlugin;
