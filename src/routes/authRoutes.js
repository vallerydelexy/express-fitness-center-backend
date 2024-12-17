// src/routes/authRoutes.js
import express from 'express';
import AuthController from '../controllers/authController.js';
import ValidationMiddleware from '../middleware/validationMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();
// #swagger prefix="/auth"
router.post(
  '/login', 
  ValidationMiddleware.loginValidation(),
  AuthController.login
);
// #swagger prefix="/auth"
router.post(
  '/logout', 
  authMiddleware, 
  AuthController.logout
);
// #swagger prefix="/auth"
router.post(
  '/reset-password', 
  body('email').isEmail(), 
  AuthController.resetPassword
);
// #swagger prefix="/auth"
router.post(
  '/confirm-reset', 
  body('token').notEmpty(),
  body('newPassword')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  AuthController.confirmPasswordReset
);

export default router;