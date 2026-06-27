const mongoose = require("mongoose");
const conectarDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conexión exitosa con mongodb");
  } catch (error) {
    console.error("error al conectar a mongodb", error.message);
    process.exit(1);
  }
};

module.exports = conectarDb;
