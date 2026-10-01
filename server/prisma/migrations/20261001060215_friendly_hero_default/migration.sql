-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_StoreSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'store',
    "shopName" TEXT NOT NULL DEFAULT 'SABA READYMADE',
    "ownerName" TEXT NOT NULL DEFAULT 'Mr. MD Jawed Equbal',
    "phone" TEXT NOT NULL DEFAULT '8210869821',
    "whatsapp" TEXT NOT NULL DEFAULT '8210869821',
    "address" TEXT NOT NULL DEFAULT 'Gudri Bazar, Laheriyasarai, Darbhanga, Bihar, India',
    "description" TEXT NOT NULL DEFAULT 'Everyday fashion for the whole family.',
    "websiteCredit" TEXT NOT NULL DEFAULT 'Mr. Amber Rehan',
    "announcement" TEXT NOT NULL DEFAULT 'Fresh styles. Lovely prices. Made for you.',
    "heroTitle" TEXT NOT NULL DEFAULT 'Find your everyday favorite.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Thoughtful styles for every version of you.',
    "heroImageUrl" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_StoreSettings" ("address", "announcement", "description", "heroImageUrl", "heroSubtitle", "heroTitle", "id", "ownerName", "phone", "shopName", "updatedAt", "websiteCredit", "whatsapp") SELECT "address", "announcement", "description", "heroImageUrl", "heroSubtitle", "heroTitle", "id", "ownerName", "phone", "shopName", "updatedAt", "websiteCredit", "whatsapp" FROM "StoreSettings";
DROP TABLE "StoreSettings";
ALTER TABLE "new_StoreSettings" RENAME TO "StoreSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
