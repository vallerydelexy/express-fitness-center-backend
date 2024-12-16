// src/routes/subscriptionRoutes.js
import express from 'express';
import SubscriptionController from '../controllers/subscriptionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/services', 
  authMiddleware, 
  SubscriptionController.getAvailableServices
);

router.post(
  '/subscribe', 
  authMiddleware, 
  SubscriptionController.subscribe
);

router.delete(
  '/:subscriptionId/cancel', 
  authMiddleware, 
  SubscriptionController.cancelSubscription
);

router.post(
  '/:subscriptionId/extend', 
  authMiddleware, 
  SubscriptionController.extendSubscription
);

export default router;