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
  for (let i = 0; i < 2; i++) {
    const serviceTypes = [
      {
        name: i === 0 
          ? "Program Penurunan Berat Badan untuk Obesitas" 
          : "Program Pemeliharaan Kebugaran Tubuh",
        type: i === 0 ? 'OVERWEIGHT' : 'FITNESS_MAINTENANCE',
        price: i === 0 ? 500000 : 350000, // Price in Indonesian Rupiah
        schedule: i === 0 
          ? "Senin, Rabu, Jumat pukul 07:00 WIB" 
          : "Selasa, Kamis pukul 18:00 WIB",
        duration: i === 0 ? 12 : 8, // Total number of sessions
      }
    ];
  
    const service = await prisma.service.create({
      data: {
        name: serviceTypes[0].name,
        type: serviceTypes[0].type,
        price: serviceTypes[0].price,
        schedule: serviceTypes[0].schedule,
        duration: serviceTypes[0].duration,
      },
    });
  
    // Create Exercises for each Service
    const exerciseDetails = i === 0 
      ? [
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
      : [
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
        ];
  
    // Create Exercises
    for (const exercise of exerciseDetails) {
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
