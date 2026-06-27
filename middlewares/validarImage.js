const postImageSchema = require("../schemas/postImage.schema.js"); 

const validarPostImage = (req, res, next) => {
  const { error } = postImageSchema.validate(req.body);
  if (error) {

    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validarPostImage;