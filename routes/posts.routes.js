const { Router } = require("express");
const {
  obtenerPosts,
  obtenerPost,
  crearPost,
  actualizarPost,
  eliminarPost,
  agregarImagen,
  eliminarImagenDePost,
  obtenerImagenesDePost,
  agregarImagenMulter,
  obtenerComentariosDeUnPost
} = require("../controllers/posts.controllers.js");

const {
  validarActualizarPost,
  validarPost,
} = require("../middlewares/validarPost.js");
const validarExistePost = require("../middlewares/validarExistePost.js");
const validarPostId = require("../middlewares/validarPostId.js");
const validarPostImage = require("../middlewares/validarImage.js");
const { validarImageId } = require("../middlewares/validarImageId.js");
const router = Router();

//esto lo necesitamos para traer todos los post de un usuario especifico
const validarUsuarioId = require("../middlewares/validarUsuarioId.js");

// importamos la configuracion de multer
const upload = require("../middlewares/upload.js");

router.get("/", obtenerPosts); //funciona
router.get("/:id", validarExistePost, obtenerPost); //funciona

router.post("/", validarPost, crearPost); //funciona-
router.put("/:id", validarPostId, validarActualizarPost, actualizarPost); //funciona-
router.delete("/:id", validarPostId, eliminarPost); //funciona

//Todos los comentarios de un post
router.get("/:id/comentarios", validarPostId, obtenerComentariosDeUnPost);

//Post Images
router.get("/:id/imagenes", validarPostId, obtenerImagenesDePost);
router.post("/:id/imagenes", validarPostId, validarPostImage, agregarImagen); //funciona-

//probemos si multer funciona como endpoint separado -- funciona
router.post(
  "/:id/upload/imagenes",
  validarPostId,
  upload.single("image"), // procesa el archivo y lo deja en req
  agregarImagenMulter,
);

router.delete(
  "/:id/imagenes/:imageId",
  validarPostId,
  validarImageId,
  eliminarImagenDePost,
); //funciona

module.exports = router;
