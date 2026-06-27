const { Post, Comment } = require("../models/index.js");

const validarExistePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Buscamos el post trayendo solo lo necesario para validar su existencia y autoría
    const post = await Post.findById(id)
      .populate("autor", "-password")
      .populate("tags", "nombre");

    // Si el post no existe, cortamos la ejecución acá
    if (!post) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Guardamos el post en el objeto req para que el controlador que sigue pueda usarlo
    req.post = post;
    next();
  } catch (error) {
    console.error("Error en middleware validarExistePost:", error);
    return res.status(500).json({ message: "Error interno al buscar el post" });
  }
};

module.exports = validarExistePost;
