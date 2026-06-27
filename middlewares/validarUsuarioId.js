const { User } = require("../models/index.js");

const validarUsuarioId = async (req, res, next) => {
  try {
    // Busca en req.params si existe, sino busca en req.body
    const id = req.params.id || req.body.userId;
    if (!id) {
      return res
        .status(400)
        .json({ message: "El ID del usuario es obligatorio" });
    }
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al validar el usuario" });
  }
};

module.exports = validarUsuarioId;
