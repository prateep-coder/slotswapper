import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: await bcrypt.hash('password123', 12),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: await bcrypt.hash('password123', 12),
    },
  });

  // Create sample events
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Alice's events
  await prisma.event.createMany({
    data: [
      {
        title: 'Team Meeting',
        startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(11, 0, 0, 0)),
        status: 'SWAPPABLE',
        ownerId: user1.id,
      },
      {
        title: 'Project Review',
        startTime: new Date(dayAfterTomorrow.setHours(14, 0, 0, 0)),
        endTime: new Date(dayAfterTomorrow.setHours(15, 0, 0, 0)),
        status: 'BUSY',
        ownerId: user1.id,
      },
    ],
  });

  // Bob's events
  await prisma.event.createMany({
    data: [
      {
        title: 'Focus Time',
        startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(15, 0, 0, 0)),
        status: 'SWAPPABLE',
        ownerId: user2.id,
      },
      {
        title: 'Client Call',
        startTime: new Date(dayAfterTomorrow.setHours(10, 0, 0, 0)),
        endTime: new Date(dayAfterTomorrow.setHours(11, 0, 0, 0)),
        status: 'BUSY',
        ownerId: user2.id,
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Test users created:`);
  console.log(`   - Alice: alice@example.com / password123`);
  console.log(`   - Bob: bob@example.com / password123`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    
  })
  .finally(async () => {
    await prisma.$disconnect();
  });