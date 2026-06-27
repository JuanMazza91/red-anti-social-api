const { User } = require("../models/index.js");
const {
  postSchema,
  actualizarPostSchema,
} = require("../schemas/post.schema.js");

const validarPost = async (req, res, next) => {
  try {
    const { error } = postSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const usuario = await User.findById(req.body.autor);
    if (!usuario) return res.status(404).json({ error: "El autor no existe" });

    next();
  } catch (error) {
    res.status(500).json({ error: "Error al validar el post" });
  }
};

const validarActualizarPost = (req, res, next) => {
  const { error } = actualizarPostSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = { validarPost, validarActualizarPost };
