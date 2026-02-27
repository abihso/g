// config/db.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

export const prisma = new PrismaClient({
  log: ["error", "warn"]
});

export const connectDb = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}; 
 
export const disconnectDb = async () => {
  await prisma.$disconnect();
};