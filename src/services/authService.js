// src/services/authService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import EmailService from './emailService.js';

class AuthService {
  static async generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { 
      expiresIn: '1h' 
    });
  }

  static async login(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id);
  }

  static async resetPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = this.generateResetToken();
    
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken }
    });

    await EmailService.sendPasswordResetEmail(email, resetToken);
    return resetToken;
  }

  static async confirmPasswordReset(token, newPassword) {
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetPasswordToken: null 
      }
    });
  }

  static generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
}

export default AuthService;