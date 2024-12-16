// src/services/emailService.js
import nodemailer from 'nodemailer';

class EmailService {
  static async sendVerificationEmail(email, token) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: '"Fitness Center" <noreply@fitnesscenter.com>',
      to: email,
      subject: 'Email Verification',
      html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `
    });
  }

  // ... other methods remain the same
}

export default EmailService;