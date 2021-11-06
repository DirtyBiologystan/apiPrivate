const mongoose = require("mongoose");

module.exports = async () => {
  return mongoose.connect("mongodb://mongo/drapeau");
};
