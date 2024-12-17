// src/services/emailService.js
import nodemailer from "nodemailer";

class EmailService {
  static async sendVerificationEmail(email, token) {
    const verificationLink = `${process.env.HOST}:${process.env.PORT}/api/register/verify-email?token=${token}`;
    if (process.env.NODE_ENV === "production") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: '"Fitness Center" <noreply@fitnesscenter.com>',
        to: email,
        subject: "Email Verification",
        html: `
        <h1>Verify Your Email</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 1 hour.</p>
      `,
      });
    } else {
      console.log(verificationLink);
      console.log(token);
    }
  }
  
  static async sendOTPEmail(email, otpCode) {
    if (process.env.NODE_ENV === "production") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: '"Fitness Center" <noreply@fitnesscenter.com>',
        to: email,
        subject: "Your Payment Verification Code",
        html: `
        <h1>Payment Verification</h1>
        <p>Your One-Time Password (OTP) for payment verification is:</p>
        <h2>${otpCode}</h2>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not initiate this payment, please ignore this email.</p>
        `
      });
    } else {
      console.log(`OTP for ${email}: ${otpCode}`);
    }
  }
}

export default EmailService;
