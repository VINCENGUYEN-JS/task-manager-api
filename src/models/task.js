const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

taskSchema.methods.toJSON = function () {
  const task = this;
  return task.toObject();
};

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
