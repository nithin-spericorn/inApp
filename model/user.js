const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      password: String,
    },
    {
      timestamps: true,
      underscored: true,
    }
  )
);

module.exports = User;
