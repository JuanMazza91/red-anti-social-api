const { Comment, User, Post } = require("../models");
const { redisClient } = require("../config/redis");

const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comment.find({ visible: true });
    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios" });
  }
};

const obtenerComentario = async (req, res) => {
  try {
    const comentario = await Comment.findById(req.comentario._id)
      .populate("autor", "-password")
      .populate("post");

    return res.status(200).json(comentario);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el comentario completo" });
  }
};

const crearComentario = async (req, res) => {
  try {
    const { contenido, autor, post } = req.body;

    const comentario = await Comment.create({
      contenido,
      autor,
      post: post,
    });

    await redisClient.del("posts");

    return res.status(201).json({
      message: "Comentario creado correctamente",
      comentario,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear el comentario" });
  }
};

const actualizarComentario = async (req, res) => {
  try {
    const { contenido } = req.body;
    const comentario = req.comentario; // El comentario ya viene validado y adjuntado por el middleware validarComentarioId

    comentario.contenido = contenido;
    await comentario.save();

    res
      .status(200)
      .json({ message: "Comentario actualizado correctamente", comentario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el comentario" });
  }
};

// Eliminar un comentario
const eliminarComentario = async (req, res) => {
  try {
    const comentario = req.comentario;

    await redisClient.del("posts");
    await comentario.deleteOne();
    res.status(200).json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el comentario" });
  }
};

module.exports = {
  obtenerComentario,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  obtenerComentarios,
};
