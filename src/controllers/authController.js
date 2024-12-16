// src/controllers/authController.js
import AuthService from '../services/authService.js';

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      
      res.status(200).json({ 
        message: 'Login successful', 
        token 
      });
    } catch (error) {
      res.status(401).json({ 
        error: error.message 
      });
    }
  }

  static async logout(req, res) {
    try {
      // In a real-world scenario, you might want to invalidate the token
      res.status(200).json({ 
        message: 'Logout successful' 
      });
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { email } = req.body;
      await AuthService.resetPassword(email);
      
      res.status(200).json({ 
        message: 'Password reset instructions sent to your email' 
      });
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  static async confirmPasswordReset(req, res) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.confirmPasswordReset(token, newPassword);
      
      res.status(200).json({ 
        message: 'Password reset successful' 
      });
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

export default AuthController;