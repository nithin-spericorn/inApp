const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.User = require("./user");
db.Task = require("./Task");

module.exports = db;
