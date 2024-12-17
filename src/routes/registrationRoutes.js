// src/routes/registrationRoutes.js
import express from "express";
import RegistrationController from "../controllers/registrationController.js";
import ValidationMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/",
  /*  
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $name: 'Rizki Aprita',
            $email: 'email@gmail.com',
            $password: 'Password1@3',
            $phoneNumber: '+6281234567890',
            creditCard: {
                number: '6282798719838231',
                cvv: '123',
                expiryDate: '2027-12-01',
                holderName: 'Rizki Aprita'
            }
        }
    }
*/

  ValidationMiddleware.registerValidation(),
  RegistrationController.register
);
// #swagger.parameters['token'] = { in: 'query', required: true, type: 'string' }
router.get("/verify-email", RegistrationController.verifyEmail);

router.post("/check-status", RegistrationController.checkRegistrationStatus);

export default router;
