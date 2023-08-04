const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Cat Pictures API",
      version: "1.0.0",
      description: "API to manage cat pictures",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["src/controllers/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
