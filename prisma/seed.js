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

  const serviceDetails = [
    {
      name: "Program Penurunan Berat Badan untuk Obesitas dan Overweight",
      type: 'OVERWEIGHT',
      price: 500000,
      schedule: "Senin, Rabu, Jumat pukul 07:00 WIB",
      duration: 90,
      exerciseDetails: [
        {
          name: "Kardio Intensif",
          description: "Latihan kardiovaskular untuk membakar lemak dengan gerakan dinamis",
          duration: 45
        },
        {
          name: "Kekuatan Otot",
          description: "Latihan beban ringan untuk membangun massa otot dan meningkatkan metabolisme",
          duration: 30
        },
        {
          name: "Fleksibilitas dan Peregangan",
          description: "Stretching dan yoga ringan untuk meningkatkan mobilitas dan mencegah cedera",
          duration: 15
        }
      ]
    },
    {
      name: "Program Pemeliharaan Kebugaran Tubuh",
      type: 'FITNESS_MAINTENANCE',
      price: 350000,
      schedule: "Selasa, Kamis pukul 18:00 WIB",
      duration: 90,
      exerciseDetails: [
        {
          name: "High-Intensity Interval Training (HIIT)",
          description: "Latihan interval intensitas tinggi untuk menjaga kebugaran dan stamina",
          duration: 40
        },
        {
          name: "Latihan Kekuatan Fungsional",
          description: "Gerakan yang meniru aktivitas sehari-hari untuk meningkatkan kekuatan dan koordinasi",
          duration: 35
        },
        {
          name: "Mindfulness dan Relaksasi",
          description: "Teknik pernapasan dan meditasi untuk kesehatan mental dan fisik",
          duration: 15
        }
      ]
    }
  ];
  
  const services = [];
  
  for (const serviceDetail of serviceDetails) {
    const service = await prisma.service.create({
      data: {
        name: serviceDetail.name,
        type: serviceDetail.type,
        price: serviceDetail.price,
        schedule: serviceDetail.schedule,
        duration: serviceDetail.duration,
      },
    });
  
    // Create Exercises
    for (const exercise of serviceDetail.exerciseDetails) {
      await prisma.exercise.create({
        data: {
          serviceId: service.id,
          name: exercise.name,
          description: exercise.description,
          duration: exercise.duration,
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
