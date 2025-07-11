const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  email: String,
  name: String,
});

module.exports = mongoose.model("User", userSchema);
