const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // le pasamos el destino, la carpeta tiene que existir
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // mantengo la extension del archivo
  },
});

const upload = multer({ storage: storage }); // le indicamos a multer la configuracion de almancenamiento que vamos a usar

// esto hay que usarlo en post.routes
// upload.single("image"); // image es el nombre del campo que vamos a poner en el body de "data-form" para subir la imagen

module.exports = upload;
