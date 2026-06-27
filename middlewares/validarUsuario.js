const {
  usuarioSchema,
  actualizarUsuarioSchema,
} = require("../schemas/usuario.schema.js");
const { User } = require("../models/index.js");

const validarUsuario = async (req, res, next) => {
  const { error } = usuarioSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { nickname, email } = req.body;

  const existeNickname = await User.findOne({ nickname });
  if (existeNickname) {
    return res
      .status(400)
      .json({ error: "El nickname que intentas utilizar no esta disponible" });
  }

  const existeEmail = await User.findOne({ email });
  if (existeEmail) {
    return res
      .status(400)
      .json({ error: "El email que intentas utilizar no esta disponible" });
  }

  next();
};

//Para poder actualizar campos del usuario por separado
const validarActualizarUsuario = async (req, res, next) => {
  const { error } = actualizarUsuarioSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { nickname, email } = req.body;
  const { id } = req.params;

  if (nickname) {
    const existeNickname = await User.findOne({ nickname, _id: { $ne: id } });
    if (existeNickname)
      return res.status(400).json({
        error: "El nickname que intentas utilizar no esta disponible",
      });
  }

  if (email) {
    const existeEmail = await User.findOne({ email, _id: { $ne: id } });
    if (existeEmail)
      return res
        .status(400)
        .json({ error: "El email que intentas utilizar no esta disponible" });
  }

  next();
};

module.exports = { validarUsuario, validarActualizarUsuario };
