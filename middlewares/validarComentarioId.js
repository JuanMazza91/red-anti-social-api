const { Comment } = require("../models/index.js");

const validarComentarioId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ message: "El ID del comentario es obligatorio" });

    const comentario = await Comment.findById(id);
    if (!comentario)
      return res.status(404).json({ message: "Comentario no encontrado" });

    req.comentario = comentario;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al validar el comentario" });
  }
};

module.exports = validarComentarioId;
