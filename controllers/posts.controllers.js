const { Post, User, Comment, Tag } = require("../models/index.js");
const { redisClient } = require("../config/redis");

const obtenerPosts = async (req, res) => {
  try {
    const postEnCache = await redisClient.get("posts");
    if (postEnCache) {
      console.log("Posts obtenidos desde Redis");
      return res.status(200).json({
        origen: "redis",
        match: { visible: true },
        posts: JSON.parse(postEnCache),
      });
    }

    const posts = await Post.find()
      .populate("autor", "-password")
      .populate("tags", "nombre")
      .sort({ createdAt: -1 });

    await redisClient.set("posts", JSON.stringify(posts), { EX: 300 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los posts" });
  }
};

const obtenerPost = async (req, res) => {
  try {
    const postConComentarios = await req.post.populate([
      {
        path: "autor",
        select: "nickname",
      },
      {
        path: "tags",
        select: "nombre"
      },
      {
      path: "comentarios",
        populate: {
          path: "autor",
          select: "nickname",
          },
      },
    ]); // ahora muestra los comentarios

    return res.status(200).json(postConComentarios);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener el post" });
  }
};

const crearPost = async (req, res) => {
  try {
    const { texto, autor, imagenes, tags } = req.body;

    const post = await Post.create({
      texto,
      autor,
      imagenes: imagenes ? imagenes.map((url) => ({ url })) : [],
      tags: tags || [],
    });

    //Si el post tiene tags, los actualizamos
    if (tags && tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: tags } },
        { $push: { posts: post._id } },
      );
    }

    await redisClient.del("posts");

    res.status(201).json({ message: "Post creado correctamente", post });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al crear el post", error: error.message });
  }
};

const actualizarPost = async (req, res) => {
  try {
    const { texto } = req.body;
    const post = req.post; // Obtenemos el post validado por el middleware
    post.texto = texto;
    await post.save();
    await redisClient.del("posts");
    res.status(200).json({ message: "Post actualizado correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el post" });
  }
};

const eliminarPost = async (req, res) => {
  try {
    const post = req.post;

    await Tag.updateMany({ posts: post._id }, { $pull: { posts: post._id } });
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    await redisClient.del("posts");

    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (error) {
    console.error("ERROR AL ELIMINAR POST:", error);
    res.status(500).json({ message: "Error al eliminar el post" });
  }
};

const agregarImagen = async (req, res) => {
  try {
    const { url } = req.body;
    const post = req.post;

    post.imagenes.push({ url });
    await post.save();
    await redisClient.del("posts");
    res.status(200).json({ message: "Imagen agregada correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la imagen" });
  }
};

//agregar imagen usando multer

const agregarImagenMulter = async (req, res) => {
  try {
    const post = req.post;
    //const PORT = process.env || 3000;
    const url = `http://localhost:${process.env.PORT}/uploads/${req.file.filename}`;

    post.imagenes.push({ url });
    await post.save();
    await redisClient.del("posts");
    res.status(200).json({ message: "Imagen agregada correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar la imagen" });
  }
};

const eliminarImagenDePost = async (req, res) => {
  try {
    const imageId = req.imagen._id;
    const post = req.post;

    post.imagenes.id(imageId).deleteOne();
    await post.save();
    await redisClient.del("posts");
    res.status(200).json({ message: "Imagen eliminada correctamente", post });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la imagen" });
  }
};

const obtenerImagenesDePost = async (req, res) => {
  try {
    const postImagenes = req.post.imagenes;
    res.status(200).json(postImagenes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las imágenes" });
  }
};

const obtenerPostsDeUserId = async (req, res) => {
  try {
    const userId = req.usuario._id;

    const posts = await Post.find({ autor: userId }).populate("comentarios");
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener los posts" });
  }
};

const obtenerComentariosDeUnPost = async (req, res) => {
  try {
    const postId = req.post._id;

    //  VALIDACIÓN DE TIEMPO: Calculamos la fecha límite (6 meses por defecto)
    const mesesLimite = parseInt(process.env.COMMENT_MAX_AGE_MONTHS) || 6;
    const fechaLimite = new Date();
    fechaLimite.setMonth(fechaLimite.getMonth() - mesesLimite);

    //  ACTUALIZACIÓN: Ocultamos los comentarios viejos de ESTE post antes de traerlos
    await Comment.updateMany(
      {
        post: postId,
        createdAt: { $lt: fechaLimite },
        visible: true,
      },
      { $set: { visible: false } },
    );

    //  CONSULTA: Traemos solo los comentarios de este post que sigan siendo visibles
    const comentarios = await Comment.find({
      post: postId,
      visible: true,
    })
      .populate("autor", "nickname") // Trae el nickname del creador del comentario
      .sort({ createdAt: -1 }); // Los más recientes primero

    // RESPUESTA: Devolvemos los comentarios al cliente
    return res.status(200).json(comentarios);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener los comentarios" });
  }
};

module.exports = {
  obtenerPosts,
  obtenerPost,
  crearPost,
  actualizarPost,
  eliminarPost,
  agregarImagen,
  agregarImagenMulter,
  eliminarImagenDePost,
  obtenerImagenesDePost,
  obtenerPostsDeUserId,
  obtenerComentariosDeUnPost,
};
