import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to PostgreSQL via Prisma');
  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    process.exit(1);
  }
}
