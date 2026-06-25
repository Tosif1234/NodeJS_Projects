import mongoose from 'mongoose';
import softDeletePlugin from '../utils/softDeletePlugin.js';

const voteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

const pollOptionSchema = new mongoose.Schema({
  optionText: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true,
  },
  votes: [voteSchema],
});

const pollSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Poll question is required'],
      trim: true,
    },
    pollType: {
      type: String,
      enum: ['Single', 'Multiple'],
      default: 'Single',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    options: {
      type: [pollOptionSchema],
      validate: [
        (val) => val.length >= 2,
        'A poll must have at least two options',
      ],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
    },
  },
  {
    timestamps: true,
  }
);

pollSchema.plugin(softDeletePlugin);

const Poll = mongoose.model('Poll', pollSchema);

export default Poll;
