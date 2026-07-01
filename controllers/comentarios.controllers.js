const { Comment, User, Post } = require("../models");
const { redisClient } = require("../config/redis");

const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comment.find({ visible: true })
    .populate({
        path:"autor",
        select:"nickname avatar",
    });

    console.log("AUTOR:");
    console.log(comentarios[0]?.autor);
    const usuario = await User.findById(comentarios[0].autor._id);
    console.log("USUARIO COMPLETO:");
    console.log(usuario);

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los comentarios" });
  }
};

const obtenerComentario = async (req, res) => {

  try {
    const comentario = await Comment.findById(req.comentario._id)
      .populate({
        path:"autor",
        select: "nickname avatar",
      })
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

    console.log("Comentario creado:", comentario);

    const postActualizado = await Post.findByIdAndUpdate(
      post,
      {
        $push: { 
          comentarios: comentario._id 
        },
      },
      { new: true }
    );

    console.log("Post después de crear comentario:", postActualizado);

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
