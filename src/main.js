console.log("UnaHur - Anti-Social net");

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const conectarDb = require("../config/db");
const PORT = process.env.PORT || 3000;
const { conectarRedis } = require("../config/redis");

//Documentacion
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../helpers/swagger");

//Routes
const usuariosRouter = require("../routes/usuarios.routes.js");
const postsRouter = require("../routes/posts.routes.js");
const comentariosRouter = require("../routes/comentarios.routes.js");
const tagsRouter = require("../routes/tags.routes.js");

//EndPoints
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/usuarios", usuariosRouter);
app.use("/posts", postsRouter);
app.use("/comentarios", comentariosRouter);
app.use("/tags", tagsRouter);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Levantamos el servidor usando la variable PORT
const start = async () => {
  try {
    await conectarDb();
    await conectarRedis();
    app.listen(PORT, () => {
      console.log(
        `Servidor de la Red Anti-Social corriendo en http://localhost:${PORT}`,
      );
    });
  } catch (error) {
    console.log("Error al conectar o sincronizar la base de datos:", error);
  }
};

start();