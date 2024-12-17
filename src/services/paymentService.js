import prisma from '../config/database.js';
import EmailService from './emailService.js';
import {generateOTP} from '../config/encryption.js';

class PaymentService {

  // Create a payment transaction
  static async initiatePayment(userId, serviceId) {
    // Find the service to get the price
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Create a payment transaction
    const paymentTransaction = await prisma.paymentTransaction.create({
      data: {
        userId,
        serviceId,
        amount: service.price,
        status: 'PENDING',
        otpCode: generateOTP(),
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
      }
    });

    // Send OTP via email
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    await EmailService.sendOTPEmail(user.email, paymentTransaction.otpCode);

    return paymentTransaction;
  }

  // Verify OTP and complete payment
  static async verifyPayment(transactionId, otpCode) {
    const paymentTransaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId }
    });

    if (!paymentTransaction) {
      throw new Error('Payment transaction not found');
    }

    // Check if OTP is expired
    if (paymentTransaction.otpExpiresAt < new Date()) {
      await prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: { status: 'EXPIRED' }
      });
      throw new Error('OTP has expired');
    }

    // Check if OTP matches
    if (paymentTransaction.otpCode !== otpCode) {
      await prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: { status: 'FAILED' }
      });
      throw new Error('Invalid OTP');
    }

    // Update payment status and create subscription
    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: { 
        status: 'VERIFIED'
      },
      include: {
        service: true
      }
    });

    // Create an active subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: updatedTransaction.userId,
        serviceId: updatedTransaction.serviceId,
        remainingSessions: updatedTransaction.service.duration,
        status: 'ACTIVE'
      }
    });

    return {
      transaction: updatedTransaction,
      subscription
    };
  }
}

export default PaymentService;