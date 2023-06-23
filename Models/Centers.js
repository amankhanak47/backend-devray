const mongoose = require("mongoose");
const { Schema } = mongoose;

const CenterSchema = new Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  contact: {
    type: Number,
  },
  slot: {
    type: Number,
  },
  date: {
    type: String,
  },
});

module.exports = mongoose.model("center", CenterSchema);
