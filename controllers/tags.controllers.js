const { Tag, Post } = require("../models");
const { redisClient } = require("../config/redis");

// Obtener todos los tags existentes
const obtenerTags = async (req, res) => {
  try {
    // En Mongoose se usa .find() para traer todos
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las etiquetas" });
  }
};

const obtenerTag = async (req, res) => {
  try {
    return res.status(200).json(req.tag);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener la etiqueta" });
  }
};

const crearTag = async (req, res) => {
  try {
    const { nombre } = req.body;

    const nuevoTag = await Tag.create({ nombre });
    return res.status(201).json(nuevoTag);
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la etiqueta" });
  }
};

const actualizarTag = async (req, res) => {
  try {
    const { nombre } = req.body;
    const tag = req.tag;
    tag.nombre = nombre;
    await tag.save();
    return res
      .status(200)
      .json({ message: "Tag actualizado correctamente", tag });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar la etiqueta" });
  }
};

const eliminarTag = async (req, res) => {
  try {
    const tag = req.tag;
    // Desvincular el tag de todos los posts que lo tienen
    await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });
    await tag.deleteOne();
    return res.status(200).json({ message: "Tag eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la etiqueta" });
  }
};

const obtenerPostsPorTag = async (req, res) => {
  try {
    const tag = req.tag;
    // Le decimos a Mongoose que cargue los datos reales de los posts dentro del tag
    await tag.populate({
      path: "posts",
      select: "texto imagenes autor tags",
    });
    // Devolvemos solo el array de posts ya populado
    return res.status(200).json(tag.posts);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener los posts de la etiqueta" });
  }
};

const asignarTagAPost = async (req, res) => {
  try {
    const post = req.post;
    const tag = req.tag;

    post.tags.push(tag._id);
    tag.posts.push(post._id);

    await post.save();
    await tag.save();

    await redisClient.del("posts");
    return res.status(200).json({ message: "Tag asignado con éxito al post" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  obtenerTags,
  obtenerTag,
  crearTag,
  actualizarTag,
  eliminarTag,
  obtenerPostsPorTag,
  asignarTagAPost,
};
