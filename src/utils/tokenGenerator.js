// src/utils/tokenGenerator.js
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const generateVerificationToken = async (email) => {
    const rand = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const salt = await bcrypt.genSalt(10);
    const token = await bcrypt.hash(email + rand, salt);
    return token;
  }