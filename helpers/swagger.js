const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Red Anti-Social",
      version: "1.0.1",
      description: "Documentación API de Red Anti-Social",
    },
  },

  apis: ["./docs/*.yml"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
