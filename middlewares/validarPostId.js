const { Post } = require("../models/index");

const validarPostId = async (req, res, next) => {
  const id = req.params.id || req.body.postid; // Buscamos el ID en params o en body, dependiendo de la ruta
  try {
    if (!id) {
      return res.status(400).json({ message: "El ID del post es obligatorio" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }
    req.post = post;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Error al validar el ID del post" });
  }
};

module.exports = validarPostId;
