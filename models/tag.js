const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
