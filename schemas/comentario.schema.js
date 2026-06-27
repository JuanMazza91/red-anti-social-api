const Joi = require("joi");

const comentarioSchema = Joi.object({
  contenido: Joi.string().trim().min(1).required().messages({
    "string.empty": "El comentario no puede estar vacío",
    "string.min": "El comentario no puede estar vacío",
    "any.required": "El contenido es obligatorio",
  }),
  autor: Joi.string().hex().length(24).required().messages({
    "any.required": "El autor es obligatorio",
    "string.length": "El autor debe ser un ID válido",
  }),
  post: Joi.string().hex().length(24).required().messages({
    "any.required": "El postId es obligatorio",
    "string.length": "El postId debe ser un ID válido",
  }),
});

const actualizarComentarioSchema = Joi.object({
  contenido: Joi.string().trim().min(1).required().messages({
    "string.empty": "El comentario no puede estar vacío",
    "any.required": "El contenido es obligatorio",
  }),
});

module.exports = { comentarioSchema, actualizarComentarioSchema };
