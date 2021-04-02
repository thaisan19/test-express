const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutor = require("./tutor.model.js")(mongoose);
db.course = require("./course.model.js")(mongoose);
module.exports = db;