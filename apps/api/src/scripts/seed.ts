import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create a demo user
  const hashedPassword = await argon2.hash('demo123456');
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@entrepreneurshaadi.com' },
    update: {},
    create: {
      email: 'demo@entrepreneurshaadi.com',
      passwordHash: hashedPassword,
      fullName: 'Demo Entrepreneur',
      phone: '+91-9876543210',
      roleSought: 'cofounder',
      location: 'Bangalore, Karnataka',
      preferences: {
        industries: ['technology', 'fintech', 'healthtech'],
        stage: 'early',
        values: ['innovation', 'social-impact', 'growth']
      },
      isMcaVerified: true,
      emailVerified: true,
    },
  });

  // Create demo director verification
  await prisma.directorVerification.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      din: '08123456',
      nameAsPerMca: 'DEMO ENTREPRENEUR',
      dinAllotmentDate: new Date('2020-01-15'),
      isActive: true,
      companies: [
        {
          cin: 'U72900KA2020PTC123456',
          name: 'Demo Tech Solutions Private Limited',
          designation: 'Director',
          from: '2020-02-01',
          to: null,
          status: 'Active'
        },
        {
          cin: 'U65990KA2018PTC789012',
          name: 'Innovation Labs Private Limited',
          designation: 'Managing Director',
          from: '2018-06-15',
          to: '2021-12-31',
          status: 'Active'
        }
      ]
    },
  });

  // Create demo companies
  await prisma.company.upsert({
    where: { cin: 'U72900KA2020PTC123456' },
    update: {},
    create: {
      cin: 'U72900KA2020PTC123456',
      name: 'Demo Tech Solutions Private Limited',
      status: 'Active',
      type: 'Private Limited Company',
      industry: 'Technology',
      incorporationDate: new Date('2020-02-01'),
      paidUpCapital: BigInt(1000000), // 10 lakhs
      registeredAddress: 'Bangalore, Karnataka, India',
    },
  });

  await prisma.company.upsert({
    where: { cin: 'U65990KA2018PTC789012' },
    update: {},
    create: {
      cin: 'U65990KA2018PTC789012',
      name: 'Innovation Labs Private Limited',
      status: 'Active',
      type: 'Private Limited Company',
      industry: 'Financial Services',
      incorporationDate: new Date('2018-06-15'),
      paidUpCapital: BigInt(500000), // 5 lakhs
      registeredAddress: 'Mumbai, Maharashtra, India',
    },
  });

  // Create company-director relationships
  await prisma.companyDirector.upsert({
    where: { 
      cin_din: { 
        cin: 'U72900KA2020PTC123456', 
        din: '08123456' 
      } 
    },
    update: {},
    create: {
      cin: 'U72900KA2020PTC123456',
      din: '08123456',
      designation: 'Director',
      appointmentDate: new Date('2020-02-01'),
      isActive: true,
    },
  });

  await prisma.companyDirector.upsert({
    where: { 
      cin_din: { 
        cin: 'U65990KA2018PTC789012', 
        din: '08123456' 
      } 
    },
    update: {},
    create: {
      cin: 'U65990KA2018PTC789012',
      din: '08123456',
      designation: 'Managing Director',
      appointmentDate: new Date('2018-06-15'),
      cessationDate: new Date('2021-12-31'),
      isActive: false,
    },
  });

  // Create demo persona
  await prisma.persona.upsert({
    where: { userId: demoUser.id },
    update: {},
    create: {
      userId: demoUser.id,
      seniority: 'Growth',
      archetype: 'Serial Founder',
      experienceScore: 85,
      governanceScore: 78,
      industryAffinity: {
        technology: 0.4,
        fintech: 0.35,
        healthtech: 0.25
      },
      features: {
        activeCompanies: 1,
        totalCompanies: 2,
        yearsAsDirector: 4,
        averageTenure: 2.5
      }
    },
  });

  console.log('✅ Database seed completed successfully!');
  console.log(`📧 Demo user: demo@entrepreneurshaadi.com / demo123456`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });