import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    body: {
      type: String,
      required: true
    },

    imgUrl: {
      type: String
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true
    },

    tags: {
      type: [String],
      index: true
    },

    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true 
  }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;