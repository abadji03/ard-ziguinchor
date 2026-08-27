-- AlterTable
ALTER TABLE "communes" ADD COLUMN     "arrondissementId" TEXT;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "arrondissementId" TEXT,
ADD COLUMN     "communeId" TEXT,
ADD COLUMN     "departementId" TEXT,
ADD COLUMN     "sousType" TEXT,
ADD COLUMN     "typePlanification" TEXT NOT NULL DEFAULT 'AUTRE';

-- CreateTable
CREATE TABLE "arrondissements" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "departementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "arrondissements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "arrondissements_code_key" ON "arrondissements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "arrondissements_nom_departementId_key" ON "arrondissements"("nom", "departementId");

-- AddForeignKey
ALTER TABLE "arrondissements" ADD CONSTRAINT "arrondissements_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communes" ADD CONSTRAINT "communes_arrondissementId_fkey" FOREIGN KEY ("arrondissementId") REFERENCES "arrondissements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_arrondissementId_fkey" FOREIGN KEY ("arrondissementId") REFERENCES "arrondissements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
