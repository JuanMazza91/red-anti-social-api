const { Tag, Post } = require("../models/index");

const validarExisteTag = async (req, res, next) => {
  const { id } = req.params;
  try {
    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).json({ message: "Tag no encontrado" });

    req.tag = tag; // Guardamos el tag en el req para el controlador
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error de validación del Tag" });
  }
};

const validarNombreTag = async (req, res, next) => {
  const { nombre } = req.body;
  const { id } = req.params;

  try {
    if (!nombre) {
      return res
        .status(400)
        .json({ message: "El nombre de la etiqueta es obligatorio" });
    }
    const tagExiste = await Tag.findOne({
      nombre: { $regex: `^${nombre}$`, $options: "i" },
      _id: { $ne: id }, //Excluye el id del tag que se esta validando
    });
    // evitar que alguien cree "Programacion" y "programacion" (con mayúscula y minúscula)

    if (tagExiste) {
      return res.status(400).json({ message: "La etiqueta ya existe" });
    }

    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error interno al validar la etiqueta" });
  }
};

const validarExiteTagConPosts = async (req, res, next) => {
  const { id, postId } = req.params;
  try {
    const post = await Post.findById(postId);
    const tag = await Tag.findById(id);

    if (!post) return res.status(404).json({ message: "Post no encontrado" });
    if (!tag) return res.status(404).json({ message: "Tag no encontrado" });

    // Validamos que el post no este vinsulado a ese tag
    if (post.tags.includes(tag._id)) {
      return res
        .status(400)
        .json({ message: "El tag ya está asignado a este post" });
    }

    req.post = post;
    req.tag = tag;
    next();
  } catch (error) {
    console.error("Error en middleware validarExisteTagConPosts:", error);
    return res.status(500).json({ message: "Error de validación" });
  }
};

module.exports = {
  validarExiteTagConPosts,
  validarNombreTag,
  validarExisteTag,
};
