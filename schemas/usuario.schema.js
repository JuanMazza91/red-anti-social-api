const Joi = require("joi");

const usuarioSchema = Joi.object({
  nickname: Joi.string().min(3).max(50).required().messages({
    "string.min": "El nickname debe tener al menos 3 caracteres",
    "string.max": "El nickname no puede superar los 50 caracteres",
    "any.required": "El nickname es obligatorio",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "El email no tiene un formato válido",
    "any.required": "El email es obligatorio",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "any.required": "La contraseña es obligatoria",
  }),
  avatar: Joi.string().optional().messages({
    "string.base": "El avatar debe ser un texto válido con el nombre del archivo",
  })
});


const actualizarUsuarioSchema = Joi.object({
  nickname: Joi.string().min(3).max(50).messages({
    "string.min": "El nickname debe tener al menos 3 caracteres",
    "string.max": "El nickname no puede superar los 50 caracteres",
  }),
  email: Joi.string().email().messages({
    "string.email": "El email no tiene un formato válido",
  }),
  password: Joi.string().min(6).messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
  avatar: Joi.string().optional().messages({
    "string.base": "El avatar debe ser un texto válido",
  })
})
  .min(1)
  .messages({
    "object.min": "Debe enviar al menos un campo para actualizar",
  });

module.exports = { usuarioSchema, actualizarUsuarioSchema };
