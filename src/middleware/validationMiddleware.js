// src/middleware/validationMiddleware.js
import { body, validationResult } from 'express-validator';

class ValidationMiddleware {
  static isValidCreditCardNumber(number) {
    // Remove non-digit characters
    const cleanedNumber = number.replace(/\D/g, '');
    
    // Check if the number contains only digits and has a valid length
    if (!/^\d{13,19}$/.test(cleanedNumber)) return false;

    // Luhn algorithm
    let sum = 0;
    let isEvenIndex = false;

    for (let i = cleanedNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanedNumber.charAt(i), 10);

      if (isEvenIndex) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEvenIndex = !isEvenIndex;
    }

    return sum % 10 === 0;
  }

  // Registration validation
  static registerValidation() {
    return [
      body('name').trim().notEmpty().withMessage('Name is required'),
      body('email').isEmail().withMessage('Invalid email address'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character'),
      body('phoneNumber').isMobilePhone().withMessage('Invalid phone number'),
      
      // Credit Card Validation (optional)
      body('creditCard')
        // .optional({ checkFalsy: true })
        .custom((creditCard) => {
          // Validate credit card number
          if (!creditCard.number) {
            throw new Error('Credit card number is required');
          }
          if (!this.isValidCreditCardNumber(creditCard.number)) {
            throw new Error('Invalid credit card number');
          }

          // CVV validation
          if (!creditCard.cvv) {
            throw new Error('CVV is required');
          }
          if (!/^\d{3,4}$/.test(creditCard.cvv)) {
            throw new Error('Invalid CVV');
          }

          // Expiry date validation
          if (!creditCard.expiryDate) {
            throw new Error('Expiry date is required');
          }
          const expiryDate = new Date(creditCard.expiryDate);
          const currentDate = new Date();
          
          if (isNaN(expiryDate.getTime())) {
            throw new Error('Invalid expiry date format');
          }
          if (expiryDate <= currentDate) {
            throw new Error('Credit card has expired');
          }

          // Card holder name validation
          if (!creditCard.holderName || creditCard.holderName.trim().length < 2) {
            throw new Error('Card holder name is required');
          }

          return true;
        }),
      
      (req, res, next) => this.handleValidationErrors(req, res, next)
    ];
  }

  // Login validation
  static loginValidation() {
    return [
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').notEmpty().withMessage('Password is required'),
      (req, res, next) => ValidationMiddleware.handleValidationErrors(req, res, next)
    ];
  }

  // Middleware to handle validation errors
  static handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    next();
  }
}

export default ValidationMiddleware;