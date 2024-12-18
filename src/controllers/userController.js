// src/controllers/userController.js
import prisma from "../config/database.js";
import { encryptCreditCard } from "../config/encryption.js";

class UserController {
  static async getUserProfile(req, res) {
    try {
      const { id } = req.user;

      const user = await prisma.user.findUnique({
        where: { id: id },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          status: true,
          creditCardInfo: true,
          subscriptions: {
            include: {
              service: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id } = req.user;
      const { name, creditCard } = req.body;

      if (!name || !creditCard) {
        return res.status(400).json({
          error: "Name and credit card information are required",
        });
      }

      if (!creditCard.number || !creditCard.cvv || !creditCard.expiryDate || !creditCard.holderName) {
        return res.status(400).json({
          error: "Credit card information is incomplete",
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: id },
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found",
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: id },
        data: {
          name,
          creditCardInfo: {
            update: {
              encryptedCardNumber: encryptCreditCard(creditCard.number),
                encryptedCVV: encryptCreditCard(creditCard.cvv),
                expiryDate: new Date(creditCard.expiryDate),
                cardHolderName: creditCard.holderName,
            }
           
          },
        },
        select: {
          id: true,
          name: true,
          creditCardInfo: true,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

export default UserController;
