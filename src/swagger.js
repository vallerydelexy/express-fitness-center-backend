import swaggerAutogen from "swagger-autogen";
import dotenv from 'dotenv';
dotenv.config();

const doc = { 
  info: { 
    title: "Fitness", 
    description: "fitness", 
    version: "1.0.0"
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'JWT Authorization header using the Bearer token'
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = "./swagger.json";
const routes = ["./src/app.js"];

swaggerAutogen()(outputFile, routes, doc);
