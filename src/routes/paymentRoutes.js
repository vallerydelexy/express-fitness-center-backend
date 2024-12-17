// src\routes\paymentRoutes.js
import express from 'express';
import PaymentController from '../controllers/paymentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/initiate', authMiddleware, PaymentController.initiatePayment);
router.post('/verify', authMiddleware, PaymentController.verifyPayment);

export default router;