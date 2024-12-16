// src/routes/userRoutes.js
import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/profile', 
  authMiddleware, 
  UserController.getUserProfile
);

router.put(
  '/profile', 
  authMiddleware, 
  UserController.updateProfile
);

export default router;