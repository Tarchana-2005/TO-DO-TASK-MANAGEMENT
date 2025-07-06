const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in Progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sharedWith: [
      {
        type: String, // or type: mongoose.Schema.Types.ObjectId if you're referencing users
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
