// src/controllers/registrationController.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import EmailService from '../services/emailService.js';
import { encryptCreditCard } from '../config/encryption.js';

const prisma = new PrismaClient();

class RegistrationController {
  static async register(req, res) {
    try {
      const { 
        name, 
        email, 
        password, 
        phoneNumber, 
        creditCard 
      } = req.body;

      // Check if email already exists
      const existingUser = await prisma.user.findUnique({ 
        where: { email } 
      });

      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email already registered' 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate email verification token
      const verificationToken = Math.random()
        .toString(36)
        .substring(2, 15) + 
        Math.random()
        .toString(36)
        .substring(2, 15);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phoneNumber,
          status: 'UNVERIFIED',
          emailVerifyToken: verificationToken,
          creditCardInfo: creditCard ? {
            create: {
              encryptedCardNumber: encryptCreditCard(creditCard.number),
              encryptedCVV: encryptCreditCard(creditCard.cvv),
              expiryDate: new Date(creditCard.expiryDate),
              cardHolderName: creditCard.holderName
            }
          } : undefined
        }
      });

      // Send verification email
      // await EmailService.sendVerificationEmail(
      //   email, 
      //   verificationToken
      // );

      res.status(201).json({ 
        message: 'Registration successful. Please check your email.',
        userId: user.id 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Registration failed', 
        details: error.message 
      });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      const user = await prisma.user.findUnique({ 
        where: { emailVerifyToken: token } 
      });

      if (!user) {
        return res.status(400).json({ 
          error: 'Invalid verification token' 
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: 'VERIFIED',
          emailVerifyToken: null
        }
      });

      res.status(200).json({ 
        message: 'Email verified successfully' 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Email verification failed', 
        details: error.message 
      });
    }
  }

  static async resendVerificationEmail(req, res) {
    // TODO: Implement resend verification email
  }

  static async checkRegistrationStatus(req, res) {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ 
        where: { email } 
      });
      res.status(200).json({ 
        registered: user !== null 
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to check registration status', 
        details: error.message 
      });
    }
  }
}

export default RegistrationController;