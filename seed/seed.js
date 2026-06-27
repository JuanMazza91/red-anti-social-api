require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Tag = require("../models/tag");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Mongo conectado");

    // Limpiar base
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await Tag.deleteMany({});
    await User.deleteMany({});

    console.log("🗑️ Base limpiada");

    // ======================
    // USUARIOS
    // ======================

    const usuarios = await User.create([
      {
        email: "gonza@test.com",
        nickname: "gonza",
        password: "123456",
      },
      {
        email: "maria@test.com",
        nickname: "maria",
        password: "123456",
      },
      {
        email: "juan@test.com",
        nickname: "juan",
        password: "123456",
      },
      {
        email: "ana@test.com",
        nickname: "ana",
        password: "123456",
      },
    ]);

    // Seguidores / seguidos

    usuarios[0].seguidos = [usuarios[1]._id, usuarios[2]._id];
    usuarios[1].seguidores = [usuarios[0]._id];

    usuarios[2].seguidores = [usuarios[0]._id];

    await usuarios[0].save();
    await usuarios[1].save();
    await usuarios[2].save();

    // ======================
    // TAGS
    // ======================

    const tags = await Tag.create([
      { nombre: "VidaBanana" },
      { nombre: "VibrasSelvaticas" },
      { nombre: "NegociosSimicos" },
      { nombre: "VecinosRuidosos" },
      { nombre: "GymSelvatico" },
    ]);

    // ======================
    // POSTS
    // ======================

    const posts = await Post.create([
      {
        texto: "Bananordi",
        autor: usuarios[0]._id,
        tags: [tags[0]._id, tags[1]._id, tags[2]._id],
        imagenes: [
          {
            url: "https://picsum.photos/600/400?1",
          },
        ],
      },
      {
        texto: "El tucan de arriba no me deja dormir la siesta.",
        autor: usuarios[1]._id,
        tags: [tags[3]._id],
        imagenes: [
          {
            url: "https://picsum.photos/600/400?2",
          },
        ],
      },
      {
        texto: "La mejor rama para colgarse, 10/10. Tiene el grip perfecto y está a la altura ideal para evitar depredadores aburridos.",
        autor: usuarios[2]._id,
        tags: [tags[4]._id],
      },
      {
        texto: "Me encanta esa red social, es mucho mejor que la del pajarito",
        autor: usuarios[3]._id,
      },
    ]);

    // ======================
    // COMENTARIOS
    // ======================
    await Comment.create([
      {
        contenido: "Muy bueno el post!",
        autor: usuarios[1]._id,
        post: posts[0]._id,
      },
      {
        contenido: "Gracias por compartir",
        autor: usuarios[2]._id,
        post: posts[0]._id,
      },
      {
        contenido: "MongoDB me salvó varios proyectos",
        autor: usuarios[0]._id,
        post: posts[1]._id,
      },
      {
        contenido: "Coincido totalmente",
        autor: usuarios[3]._id,
        post: posts[2]._id,
      },
      {
        contenido: "Excelente trabajo",
        autor: usuarios[0]._id,
        post: posts[3]._id,
      },
    ]);

    console.log("🎉 Seed ejecutado correctamente");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error ejecutando seed");
    console.error(error);
    process.exit(1);
  }
}

seed();