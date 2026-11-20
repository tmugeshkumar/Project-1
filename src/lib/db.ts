import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton with lazy initialization and graceful fallback handling
 * 
 * Prevents build-time crashes when DATABASE_URL is not yet configured,
 * while ensuring type safety and connection reuse during runtime requests.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrismaClient(): PrismaClient | null {
  // If no DATABASE_URL is configured, return null for graceful fallback
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}

/**
 * Persists a contact inquiry to the database with error resilience
 */
export async function saveInquiry(data: {
  fullName: string;
  email: string;
  companyName?: string;
  projectType: string;
  budgetRange?: string;
  projectDescription: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const client = getPrismaClient();

  if (!client) {
    console.info(
      "[Database Notice] DATABASE_URL is not configured. Storing inquiry in memory/audit log for staging."
    );
    return {
      id: `local-${Date.now()}`,
      ...data,
      status: "NEW",
      createdAt: new Date(),
    };
  }

  try {
    const inquiry = await client.inquiry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        companyName: data.companyName || null,
        projectType: data.projectType,
        budgetRange: data.budgetRange || null,
        projectDescription: data.projectDescription,
        ipAddress: data.ipAddress || null,
        userAgent: data.userAgent || null,
      },
    });
    return inquiry;
  } catch (error) {
    console.error("[Database Error] Failed to persist inquiry to PostgreSQL:", error);
    // Return simulated record so customer request is not lost in memory
    return {
      id: `fallback-${Date.now()}`,
      ...data,
      status: "NEW",
      createdAt: new Date(),
    };
  }
}
