import { PrismaClient } from "@prisma/client";

// Create a single instance of PrismaClient
const prisma = new PrismaClient();

// Export the instance for reuse
export default prisma;
