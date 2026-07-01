const { User, Post, Comment, Tag } = require("../models/index.js");

const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find(); // la password tiene select en false, asi que no lo va a traer
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

const obtenerUsuario = async (req, res) => {
  try {
    const usuario = req.usuario; // Obtenemos el usuario validado por el middleware
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};

const crearUsuario = async (req, res) => {
  try {
    const { nickname, email, password, avatar } = req.body;

    const usuario = await User.create({
      nickname,
      email,
      password,
      avatar,
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      usuario,
    });
  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const { nickname, email, password, avatar } = req.body;
    const usuario = req.usuario;

    if (nickname) usuario.nickname = nickname;
    if (email) usuario.email = email;
    if (password) usuario.password = password;
    if (avatar) usuario.avatar = avatar;

    await usuario.save();

    res.status(200).json({ message: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

const eliminarUsuario = async (req, res) => {
  try {
    const usuario = req.usuario; // Obtenemos el usuario validado por el middleware

    //Se elimina todo lo relacionado al usuario como seguidores,seguidos, post, comentarios y tags
    const posts = await Post.find({ autor: usuario._id });
    const postIds = posts.map((p) => p._id);

    await Tag.updateMany(
      { posts: { $in: postIds } },
      { $pull: { posts: { $in: postIds } } },
    );
    await Comment.deleteMany({ post: { $in: postIds } });
    await Comment.deleteMany({ autor: usuario._id });
    await Post.deleteMany({ autor: usuario._id });
    await User.updateMany(
      { $or: [{ seguidos: usuario._id }, { seguidores: usuario._id }] },
      { $pull: { seguidos: usuario._id, seguidores: usuario._id } },
    );

    await usuario.deleteOne(); // no hace falta pasarle argumento porque ya lo tiene usuario
    res.status(200).json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("ERROR COMPLETO DE ELIMINAR USUARIO:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

const seguirUsuario = async (req, res) => {
  try {
    const { _id: id } = req.usuario;
    const { _id: seguidorId } = req.seguidor;

    await User.findByIdAndUpdate(seguidorId, { $addToSet: { seguidos: id } });
    await User.findByIdAndUpdate(id, { $addToSet: { seguidores: seguidorId } });

    res.status(200).json({ message: "Usuario seguido" });
  } catch (error) {
    console.error("ERROR COMPLETO DE SEGUIR USUARIO:", error);
    res.status(500).json({ message: "Error al seguir usuario" });
  }
};

const dejarDeSeguir = async (req, res) => {
  try {
    const { _id: id } = req.usuario;
    const { _id: seguidorId } = req.seguidor;

    await User.findByIdAndUpdate(seguidorId, { $pull: { seguidos: id } });
    await User.findByIdAndUpdate(id, { $pull: { seguidores: seguidorId } });

    res.status(200).json({ message: "Unfollow completado" });
  } catch (error) {
    console.error("ERROR COMPLETO DE DEJAR DE SEGUIR USUARIO:", error);
    res.status(500).json({ message: "Error al dejar de seguir usuario" });
  }
};

// obtener todos los post de un usuario

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  seguirUsuario,
  dejarDeSeguir,
};
