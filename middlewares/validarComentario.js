const {
  comentarioSchema,
  actualizarComentarioSchema,
} = require("../schemas/comentario.schema.js");
const { User, Post } = require("../models/index.js");

const validarComentario = async (req, res, next) => {
  const { error } = comentarioSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { autor, post } = req.body;

  const usuarioExiste = await User.findById(autor);
  if (!usuarioExiste)
    return res.status(404).json({ error: "El autor no existe" });

  const postExiste = await Post.findById(post);
  if (!postExiste) return res.status(404).json({ error: "El post no existe" });

  next();
};

const validarActualizarComentario = (req, res, next) => {
  const { error } = actualizarComentarioSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = { validarComentario, validarActualizarComentario };
