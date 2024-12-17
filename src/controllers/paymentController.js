import PaymentService from '../services/paymentService.js';

class PaymentController {
  // Initiate payment for a service
  static async initiatePayment(req, res) {
    try {
      const { serviceId } = req.body;
      const userId = req.user.id;

      const paymentTransaction = await PaymentService.initiatePayment(userId, serviceId);

      res.status(201).json({
        message: 'Payment initiated. OTP sent to your email.',
        transactionId: paymentTransaction.id
      });
    } catch (error) {
      res.status(400).json({ 
        message: error.message 
      });
    }
  }

  // Verify payment with OTP
  static async verifyPayment(req, res) {
    try {
      const { transactionId, otpCode } = req.body;

      const result = await PaymentService.verifyPayment(transactionId, otpCode);

      res.status(200).json({
        message: 'Payment verified successfully',
        subscription: result.subscription
      });
    } catch (error) {
      res.status(400).json({ 
        message: error.message 
      });
    }
  }
}

export default PaymentController;