const mongoose = require("mongoose");
const Task = mongoose.model(
  "Task",
  new mongoose.Schema(
    {
      Task_id: { type: Number, required: false, unique: true },
      Taskname: { type: String },
      user_id: { type: String },
      status: { type: String },
      Task_completed_time: { type: String },
      ChildTaskParent: { type: Number },
    },
    {
      timestamps: true,
      underscored: true,
    }
  )
);

module.exports = Task;
