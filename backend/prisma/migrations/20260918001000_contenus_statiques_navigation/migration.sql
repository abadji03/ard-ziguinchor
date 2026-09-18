-- Externalisation des contenus statiques (pages légales, confidentialité,
-- accessibilité, mot du directeur, texte institutionnel…) et de la
-- navigation (NAV_LINKS, liens pied de page, juridiques).
-- Créé sans perte de données (CREATE TABLE uniquement).

CREATE TABLE IF NOT EXISTS "contenus_statiques" (
    "id" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "titre" TEXT,
    "contenu" TEXT NOT NULL,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contenus_statiques_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "contenus_statiques_cle_key" ON "contenus_statiques"("cle");

CREATE TABLE IF NOT EXISTS "navigation_items" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "section" TEXT NOT NULL DEFAULT 'header',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "navigation_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "navigation_items_section_ordre_idx" ON "navigation_items"("section", "ordre");
CREATE INDEX IF NOT EXISTS "navigation_items_parentId_idx" ON "navigation_items"("parentId");
ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "navigation_items"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Ajout du champ `horaires` au paramètre site (affiché dans le footer/contact).
ALTER TABLE "parametres_site" ADD COLUMN IF NOT EXISTS "horaires" TEXT;
