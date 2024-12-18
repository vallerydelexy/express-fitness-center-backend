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
    /*  
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $name: 'other name',
            creditCard: {
                number: '6282798719838231',
                cvv: '123',
                expiryDate: '2027-12-01',
                holderName: 'other name'
            }
        }
    }
*/ 
  authMiddleware, 
  UserController.updateProfile
);

export default router;