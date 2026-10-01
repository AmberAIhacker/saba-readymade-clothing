import "dotenv/config";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../src/db.js";

async function main() {
  const emailInput = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!emailInput || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env before creating the first admin.");
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error("Set a random JWT_SECRET of at least 32 characters in server/.env before creating the first admin.");
  }
  const email = z.string().email().max(254).parse(emailInput);
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }
  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin account already exists for ${email}; existing credentials were not changed.`);
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  await db.admin.create({ data: { email, passwordHash } });
  console.log(`Admin account created for ${email}. The password was stored as a bcrypt hash.`);
}

main().catch((error: unknown) => {
  console.error("Admin creation failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(async () => {
  await db.$disconnect();
});
