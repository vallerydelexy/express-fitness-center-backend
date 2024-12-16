// src/controllers/userController.js
import prisma from '../config/database.js';

class UserController {
  static async getUserProfile(req, res) {
    try {
      const { userId } = req.user;
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          status: true,
          subscriptions: {
            include: {
              service: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ 
          error: 'User not found' 
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { userId } = req.user;
      const { name, phoneNumber } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          phoneNumber
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true
        }
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

export default UserController;