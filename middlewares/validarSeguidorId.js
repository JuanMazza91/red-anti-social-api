const { User } = require("../models/index.js");

const validarSeguidorId = async (req, res, next) => {
  try {
    const { seguidorId } = req.body;
    if (!seguidorId) {
      return res.status(400).json({ message: "El seguidorId es obligatorio" });
    }
    const seguidor = await User.findById(seguidorId);
    if (!seguidor) {
      return res.status(404).json({ message: "Seguidor no encontrado" });
    }
    req.seguidor = seguidor;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar el seguidor" });
  }
};

module.exports = validarSeguidorId;
