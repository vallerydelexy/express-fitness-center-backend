// src/app.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import {validateEnv} from './config/validateEnv.js';

const app = express();
// await validateEnv();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api', (req, res) => res.json({ message: 'Welcome to the Fitness Center API!' }));
app.use('/api/auth', authRoutes);
app.use('/api/register', registrationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;