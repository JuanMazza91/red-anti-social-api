const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true, // validate: { isEmail: true } esto creo que no funciona en mongoose
      required: [true, "el email es obligatorio"],
      lowercase: true,
      trim: true,
    },
    nickname: {
      type: String,
      required: [true, "el nickname es obligatorio"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "la contraseña es obligatoria"],
      select: false,
    },
    avatar: {
      type: String,
      default: "mono1.jpeg",
    },
    seguidos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    seguidores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
