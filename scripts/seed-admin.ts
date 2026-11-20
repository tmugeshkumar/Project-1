/**
 * Secure admin account provisioning script.
 *
 * Usage:
 *   pnpm run seed:admin
 *
 * Required environment variables:
 *   ADMIN_EMAIL        - Administrator email address
 *   ADMIN_USERNAME     - Administrator username (3-30 chars, alphanumeric)
 *   ADMIN_FULL_NAME    - Administrator display name
 *   ADMIN_PASSWORD     - Strong password (min 8 chars, upper/lower/digit/special)
 *   DATABASE_URL       - PostgreSQL connection string
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const fullName = process.env.ADMIN_FULL_NAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !username || !fullName || !password) {
    console.error(
      "❌ Missing required environment variables.\n" +
      "   Set ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_FULL_NAME, and ADMIN_PASSWORD in your .env file.\n"
    );
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  console.log("🔐 Provisioning admin account...");

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });

  if (existing) {
    console.warn(
      `⚠️  An account with email "${email}" or username "${username}" already exists.\n` +
      "   Skipping seed to avoid duplicate. Delete the account first if you want to re-seed.\n"
    );
    process.exit(0);
  }

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.create({
    data: {
      email,
      username,
      fullName,
      passwordHash,
      role: "ADMIN",
      emailVerified: true,
      emailVerifiedAt: new Date(),
      accountStatus: "ACTIVE",
    },
  });

  console.log("✅ Admin account created successfully.");
  console.log(`   ID:       ${admin.id}`);
  console.log(`   Username: ${admin.username}`);
  console.log(`   Email:    ${admin.email}`);
  console.log(`   Role:     ${admin.role}`);
  console.log("\n🔑 You can now sign in at /admin/login");
  console.log("   Remove ADMIN_PASSWORD from your .env after first login.\n");
}

main()
  .catch((err: unknown) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
