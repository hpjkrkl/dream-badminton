import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@dreambadminton.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('👤 Admin user already exists');
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: 'Admin User',
      username: 'admin',
      hashedPassword,
      isAdmin: true,
      credits: 100,
      subscriptionTier: 'VIP'
    }
  });

  console.log('✅ Admin user created:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   ID: ${admin.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });