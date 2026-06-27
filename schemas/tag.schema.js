const Joi = require("joi");

const tagSchema = Joi.object({
  nombre: Joi.string().min(1).max(50).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 1 caracter",
    "string.max": "El nombre no puede superar los 50 caracteres",
    "any.required": "El nombre es obligatorio",
  }),
});

module.exports = tagSchema 
