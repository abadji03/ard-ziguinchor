-- Contenus éditoriaux : textes et listes gérés depuis l'admin (Paramètres)
-- Créé sans perte de données (CREATE TABLE uniquement).

CREATE TABLE "contenus_editoriaux" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "section" TEXT,
    "titre" TEXT NOT NULL,
    "sousTitre" TEXT,
    "description" TEXT,
    "icone" TEXT,
    "couleur" TEXT,
    "lien" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contenus_editoriaux_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "contenus_editoriaux_type_section_ordre_idx"
    ON "contenus_editoriaux"("type", "section", "ordre");
