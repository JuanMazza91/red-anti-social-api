const { User } = require("../models/index.js");


const validarSeguimiento = (accion) => async (req, res, next) => {
  try {
    const { _id: id } = req.usuario;
    const { _id: seguidorId } = req.seguidor;

    const seguidor = await User.findById(seguidorId);
    const yaSigue = seguidor.seguidos.some(
      (seguido) => seguido.toString() === id.toString(),
    );

    if (accion === "seguir" && yaSigue) {
      return res.status(400).json({ message: "Ya seguís a este usuario" });
    }
    if (accion === "dejarDeSeguir" && !yaSigue) {
      return res
        .status(400)
        .json({ message: "No podés dejar de seguir a alguien que no seguís" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Error al validar el seguimiento" });
  }
};

module.exports = validarSeguimiento;
