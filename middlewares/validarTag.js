const schemaTag = require("../schemas/tag.schema.js");

const validarTag = (req, res, next) => {
  const { error } = schemaTag.validate(req.body);

  if (error) {
    console.log("Error de validación:", error);
    return res.status(400).json({ error: error.details[0].message });
  }
  return next();
};

module.exports = validarTag;
