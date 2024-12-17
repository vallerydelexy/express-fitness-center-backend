// src/services/subscriptionService.js
import prisma from '../config/database.js';

class SubscriptionService {
  static async listAvailableServices() {
    return await prisma.service.findMany({
      include: {
        exercises: true
      }
    });
  }

  static async createSubscription(userId, serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    });

    if (!service) {
      throw new Error('Service not found');
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        serviceId,
        status: 'ACTIVE'
      }
    });
  
    if (existingSubscription) {
      throw new Error('You already have an active subscription to this service');
    }

    return await prisma.subscription.create({
      data: {
        userId,
        serviceId,
        remainingSessions: service.duration,
        status: 'ACTIVE'
      },
      include: {
        service: true
      }
    });
  }

  static async cancelSubscription(subscriptionId) {
    return await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { 
        status: 'CANCELLED',
        endDate: new Date()
      }
    });
  }

  static async extendSubscription(subscriptionId, additionalSessions) {
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        remainingSessions: {
          increment: additionalSessions
        }
      },
      include: {
        service: true
      }
    });

    return subscription;
  }
}

export default SubscriptionService;