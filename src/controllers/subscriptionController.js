// src/controllers/subscriptionController.js
import SubscriptionService from '../services/subscriptionService.js';

class SubscriptionController {
  static async getAvailableServices(req, res) {
    try {
      const services = await SubscriptionService.listAvailableServices();
      
      res.status(200).json(services);
    } catch (error) {
      res.status(500).json({ 
        error: error.message 
      });
    }
  }

  static async subscribe(req, res) {
    try {
      const { id } = req.user;
      const { serviceId } = req.body;
      const subscription = await SubscriptionService.createSubscription(
        id, 
        serviceId
      );
      
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  static async cancelSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      await SubscriptionService.cancelSubscription(subscriptionId);
      
      res.status(200).json({ 
        message: 'Subscription cancelled successfully' 
      });
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }

  static async extendSubscription(req, res) {
    try {
      const { subscriptionId } = req.params;
      const { additionalSessions } = req.body;
      
      const updatedSubscription = await SubscriptionService.extendSubscription(
        subscriptionId, 
        additionalSessions
      );
      
      res.status(200).json(updatedSubscription);
    } catch (error) {
      res.status(400).json({ 
        error: error.message 
      });
    }
  }
}

export default SubscriptionController;