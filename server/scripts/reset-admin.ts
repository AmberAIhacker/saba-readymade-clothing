import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../src/db.js";

async function main() {
  const emailInput = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!emailInput || !password) {
    throw new Error("Set ADMIN_EMAIL and the new ADMIN_PASSWORD in the service environment before resetting the admin password.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }
  const email = z.string().email().max(254).parse(emailInput);
  const existing = await db.admin.findUnique({ where: { email }, select: { id: true } });
  if (!existing) {
    throw new Error(`No existing admin account was found for ${email}; password reset was not applied.`);
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.admin.update({ where: { id: existing.id }, data: { passwordHash } });
  console.log(`Admin password reset completed for ${email}. The password was stored as a bcrypt hash.`);
}

main().catch((error: unknown) => {
  console.error("Admin password reset failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(async () => {
  await db.$disconnect();
});
