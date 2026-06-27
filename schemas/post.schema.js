const Joi = require("joi");

const postSchema = Joi.object({
  texto: Joi.string().min(1).required().messages({
    "string.empty": "El post no puede estar vacio",
    "any.required": "El post no puede estar vacio",
  }),
  autor: Joi.string().hex().length(24).required().messages({
    "any.required": "El autor es obligatorio",
    "string.length": "El autor debe ser un ID válido",
  }),
  imagenes: Joi.array().items(Joi.string().uri()).optional().messages({
    "string.uri": "Cada imagen debe ser una URL válida",
  }),
  tags: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

const actualizarPostSchema = Joi.object({
  texto: Joi.string().min(1).required().messages({
    "string.empty": "El post no puede estar vacío",
    "any.required": "El texto es obligatorio",
  }),
});

module.exports = { postSchema, actualizarPostSchema };
