// src/routes/registrationRoutes.js
import express from 'express';
import RegistrationController from '../controllers/registrationController.js';
import ValidationMiddleware from '../middleware/validationMiddleware.js';

const router = express.Router();

router.post(
  '/', 
  ValidationMiddleware.registerValidation(),
  RegistrationController.register
);

router.post(
  '/verify-email', 
  RegistrationController.verifyEmail
);

router.post(
  '/check-status', 
  RegistrationController.checkRegistrationStatus
);

export default router;