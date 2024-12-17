import swaggerAutogen from "swagger-autogen";
// import express from "express";
import dotenv from 'dotenv';
dotenv.config();

// const router = express.Router();

const doc = { 
  info: { 
    title: "Fitness", 
    description: "fitness", 
    version: "1.0.0"
  },
  host: `${process.env.HOST}:${process.env.PORT}`,
  basePath: "/api",
  tags: [
    {
      name: 'Auth',
      description: 'Authentication routes',
      externalDocs: {
        description: 'Authentication endpoints',
        url: '/api/auth'
      }
    }
  ],
};

const outputFile = "./swagger.json";
// const routes = [
//   "./src/routes/authRoutes.js",
//   "./src/routes/registrationRoutes.js",
//   "./src/routes/userRoutes.js",
//   "./src/routes/subscriptionRoutes.js",
// ];

const routes = ["./src/app.js"];

swaggerAutogen()(outputFile, routes, doc);
