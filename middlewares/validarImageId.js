const postImageSchema = require("../schemas/postImage.schema.js");

const validarImageId = async (req, res, next) => {
  try {
    const { imageId } = req.params;
    const post = req.post;

    const imagen = post.imagenes.find(
      (img) => img._id.toString() === imageId.toString(),
    );

    if (!imagen) {
      return res
        .status(404)
        .json({ message: "Imagen no encontrada en este post" });
    }
    req.imagen = imagen;
    next();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al validar el ID de la imagen" });
  }
};

const validarUrl = (req, res, next) => {
  try {
    const { error, value } = postImageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    req.imageUrl = value.url;

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al validar la url" });
  }
};

module.exports = { validarImageId, validarUrl };
