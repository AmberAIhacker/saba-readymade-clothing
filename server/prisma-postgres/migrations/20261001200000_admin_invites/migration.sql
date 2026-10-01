CREATE TABLE "AdminInvite" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminInvite_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AdminInvite_tokenHash_key" ON "AdminInvite"("tokenHash");
CREATE INDEX "AdminInvite_email_idx" ON "AdminInvite"("email");
CREATE INDEX "AdminInvite_expiresAt_usedAt_idx" ON "AdminInvite"("expiresAt", "usedAt");

ALTER TABLE "AdminInvite" ADD CONSTRAINT "AdminInvite_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
