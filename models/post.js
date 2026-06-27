const mongoose = require("mongoose");

const postImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const postSchema = new mongoose.Schema(
  {
    texto: {
      type: String,
      required: true,
    },
    imagenes: [postImageSchema],
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  {
    timestamps: true,
  },
);

//agregamos virtual para invertir la relacion con Comment (sirve como un atajo, no se guarda en la base de datos pero se mantiene porque usamos redis )

postSchema.virtual("comentarios", {
  ref: "Comment", // la referencia del modelo
  localField: "_id", // _id del post
  foreignField: "post", // el nombre del campo que está en comment
});

postSchema.set("toJSON", { virtuals: true, id: false }); // convertimos el resultado de la consulta a json -- deshabilitamos el id para que no salga duplicado
//postSchema.set("toObject", { virtuals: true, id: false }); // convertimos el resultado de la consulta a un objeto, si es que hace falta debugear -- deshabilitamos el id para que no salga duplicado

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
