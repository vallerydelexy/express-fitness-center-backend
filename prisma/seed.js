import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { encryptCreditCard } from '../src/config/encryption.js';

const prisma = new PrismaClient();


async function deleteAllData() {
  await prisma.subscription.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.service.deleteMany();
  await prisma.creditCardInfo.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  console.log('Seeding database...');
  await deleteAllData();

  // Create Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        phoneNumber: faker.phone.number(),
        status: faker.helpers.arrayElement(['REGISTERED', 'UNREGISTERED', 'UNVERIFIED']),
        emailVerifyToken: faker.datatype.boolean() ? faker.string.uuid() : null,
        resetPasswordToken: faker.datatype.boolean() ? faker.string.uuid() : null,
      },
    });

      await prisma.creditCardInfo.create({
        data: {
          userId: user.id,
          encryptedCardNumber: encryptCreditCard(faker.finance.creditCardNumber('63[7-9]#-####-####-###L')),
          encryptedCVV: encryptCreditCard(faker.finance.creditCardCVV()),
          expiryDate: faker.date.future(),
          cardHolderName: user.name,
        },
      });


    users.push(user);
  }

  console.log('Users created');

  // Create Services
  const services = [];
  for (let i = 0; i < 5; i++) {
    const service = await prisma.service.create({
      data: {
        name: faker.commerce.productName(),
        type: faker.helpers.arrayElement(['OVERWEIGHT', 'FITNESS_MAINTENANCE']),
        price: parseFloat(faker.commerce.price(100, 1000, 2)),
        schedule: `${faker.helpers.arrayElement(['Monday', 'Wednesday', 'Friday'])} at 10:00 AM`,
        duration: faker.number.int({ min: 5, max: 20 }),
      },
    });

    // Create Exercises for each Service
    for (let j = 0; j < 3; j++) {
      await prisma.exercise.create({
        data: {
          serviceId: service.id,
          name: faker.commerce.productMaterial(),
          description: faker.lorem.sentence(),
          duration: faker.number.int({ min: 1, max: 60 }),
        },
      });
    }

    services.push(service);
  }

  console.log('Services and Exercises created');

  // Create Subscriptions
  for (const user of users) {
    const randomService = faker.helpers.arrayElement(services);
    await prisma.subscription.create({
      data: {
        userId: user.id,
        serviceId: randomService.id,
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE', 'CANCELLED']),
        startDate: faker.date.past(),
        remainingSessions: faker.number.int({ min: 0, max: randomService.duration }),
        endDate: faker.date.future(),
      },
    });
  }

  console.log('Subscriptions created');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
