// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
// import {validateEnv} from './config/validateEnv.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' assert { type: 'json' };


const app = express();
// await validateEnv();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// #swagger.security = [{ "bearerAuth": [] }]
app.use('/api/auth', authRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;