-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITEUR', 'REDACTEUR', 'CONTRIBUTEUR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "telephone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'REDACTEUR',
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dernierLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departements" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "superficie" DOUBLE PRECISION,
    "population" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "superficie" DOUBLE PRECISION,
    "population" INTEGER,
    "description" TEXT,
    "departementId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "communes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_actualite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "couleur" TEXT DEFAULT '#0A5CCF',
    "icone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_actualite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_document" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "couleur" TEXT DEFAULT '#0A5CCF',
    "icone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secteurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "couleur" TEXT DEFAULT '#F4B400',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secteurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "fichier" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" TEXT,
    "taille" INTEGER,
    "largeur" INTEGER,
    "hauteur" INTEGER,
    "texteAlt" TEXT,
    "legende" TEXT,
    "credit" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galeries" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "galerieId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galerie_media" (
    "id" TEXT NOT NULL,
    "galerieId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "galerie_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actualites" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "contenu" TEXT NOT NULL,
    "imagePrincipale" TEXT,
    "auteurId" TEXT,
    "categorieId" TEXT,
    "statut" TEXT NOT NULL DEFAULT 'brouillon',
    "datePublication" TIMESTAMP(3),
    "vue" INTEGER NOT NULL DEFAULT 0,
    "tempsLecture" INTEGER,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projetId" TEXT,
    "programmeId" TEXT,
    "partenaireId" TEXT,

    CONSTRAINT "actualites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projets" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "description" TEXT NOT NULL,
    "objectifs" TEXT,
    "resultats" TEXT,
    "secteurId" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'planifie',
    "niveauAvancement" INTEGER NOT NULL DEFAULT 0,
    "budget" DOUBLE PRECISION,
    "budgetExecute" DOUBLE PRECISION,
    "devise" TEXT NOT NULL DEFAULT 'FCFA',
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "dateFinReelle" TIMESTAMP(3),
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "beneficiaires" INTEGER,
    "reference" TEXT,
    "imagePrincipale" TEXT,
    "createurId" TEXT,
    "departementId" TEXT,
    "communeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "programmeId" TEXT,

    CONSTRAINT "projets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programmes" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "acronyme" TEXT,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "description" TEXT NOT NULL,
    "objectifs" TEXT,
    "organismePilote" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programmes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "fichier" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "taille" INTEGER,
    "nombrePages" INTEGER,
    "auteur" TEXT,
    "datePublication" TIMESTAMP(3),
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "version" TEXT NOT NULL DEFAULT '1.0',
    "statut" TEXT NOT NULL DEFAULT 'publie',
    "telechargements" INTEGER NOT NULL DEFAULT 0,
    "createurId" TEXT,
    "categorieId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actualiteId" TEXT,
    "programmeId" TEXT,
    "projetId" TEXT,
    "partenaireId" TEXT,
    "evenementId" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evenements" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "heureDebut" TEXT,
    "heureFin" TEXT,
    "organisateur" TEXT,
    "capacite" INTEGER,
    "inscriptionOuverte" BOOLEAN NOT NULL DEFAULT true,
    "statut" TEXT NOT NULL DEFAULT 'a_venir',
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "actualiteId" TEXT,
    "programmeId" TEXT,
    "projetId" TEXT,
    "partenaireId" TEXT,

    CONSTRAINT "evenements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types_partenaire" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_partenaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partenaires" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "sigle" TEXT,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "pays" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "siteWeb" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "dateDebutPartenariat" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partenaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partenaire_projet" (
    "id" TEXT NOT NULL,
    "partenaireId" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "role" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "partenaire_projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partenaire_programme" (
    "id" TEXT NOT NULL,
    "partenaireId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "role" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),

    CONSTRAINT "partenaire_programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types_opportunite" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "types_opportunite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunites" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "resume" TEXT,
    "description" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "organisme" TEXT NOT NULL,
    "secteur" TEXT,
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLimite" TIMESTAMP(3),
    "statut" TEXT NOT NULL DEFAULT 'ouvert',
    "conditions" TEXT,
    "lienExterne" TEXT,
    "documentId" TEXT,
    "partenaireId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "membres" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "bio" TEXT,
    "photo" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "membres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "responsable" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_faq" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "reponse" TEXT NOT NULL,
    "categorieId" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "publie" BOOLEAN NOT NULL DEFAULT true,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "valeur" DOUBLE PRECISION NOT NULL,
    "unite" TEXT NOT NULL,
    "annee" INTEGER NOT NULL,
    "source" TEXT,
    "methodeCalcul" TEXT,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "secteurId" TEXT,
    "communeId" TEXT,
    "departementId" TEXT,
    "projetId" TEXT,
    "programmeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chiffres_cles" (
    "id" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chiffres_cles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temoignages" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "fonction" TEXT,
    "organisation" TEXT,
    "contenu" TEXT NOT NULL,
    "photo" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temoignages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bannieres" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "sousTitre" TEXT,
    "image" TEXT NOT NULL,
    "lien" TEXT,
    "boutonTexte" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "dateDebut" TIMESTAMP(3),
    "dateFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bannieres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "items" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reseaux_sociaux" (
    "id" TEXT NOT NULL,
    "plateforme" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "partenaireId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reseaux_sociaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parametres_site" (
    "id" TEXT NOT NULL,
    "nomSite" TEXT NOT NULL DEFAULT 'ARD Ziguinchor',
    "description" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "ville" TEXT,
    "boitePostale" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "logo" TEXT,
    "favicon" TEXT,
    "couleurPrimaire" TEXT DEFAULT '#0A5CCF',
    "couleurSecondaire" TEXT DEFAULT '#F4B400',
    "linkedin" TEXT,
    "facebook" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "instagram" TEXT,
    "googleAnalytics" TEXT,
    "matomo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parametres_site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjetMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjetMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MediaToPartenaire" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToPartenaire_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AlbumToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ActualiteToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ActualiteToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EvenementToMedia" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EvenementToMedia_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "departements_nom_key" ON "departements"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "departements_code_key" ON "departements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "communes_code_departementId_key" ON "communes"("code", "departementId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_actualite_nom_key" ON "categories_actualite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "categories_actualite_slug_key" ON "categories_actualite"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_document_nom_key" ON "categories_document"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "categories_document_slug_key" ON "categories_document"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "secteurs_nom_key" ON "secteurs"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "secteurs_slug_key" ON "secteurs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "galeries_slug_key" ON "galeries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "galerie_media_galerieId_mediaId_key" ON "galerie_media"("galerieId", "mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "actualites_slug_key" ON "actualites"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "projets_slug_key" ON "projets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "programmes_slug_key" ON "programmes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "documents_slug_key" ON "documents"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "evenements_slug_key" ON "evenements"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "evenements_actualiteId_key" ON "evenements"("actualiteId");

-- CreateIndex
CREATE UNIQUE INDEX "types_partenaire_nom_key" ON "types_partenaire"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "partenaires_slug_key" ON "partenaires"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "partenaire_projet_partenaireId_projetId_key" ON "partenaire_projet"("partenaireId", "projetId");

-- CreateIndex
CREATE UNIQUE INDEX "partenaire_programme_partenaireId_programmeId_key" ON "partenaire_programme"("partenaireId", "programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "types_opportunite_nom_key" ON "types_opportunite"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "opportunites_slug_key" ON "opportunites"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "services_nom_key" ON "services"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "categories_faq_nom_key" ON "categories_faq"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "indicateurs_slug_key" ON "indicateurs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "menus_nom_key" ON "menus"("nom");

-- CreateIndex
CREATE INDEX "_ProjetMedia_B_index" ON "_ProjetMedia"("B");

-- CreateIndex
CREATE INDEX "_MediaToPartenaire_B_index" ON "_MediaToPartenaire"("B");

-- CreateIndex
CREATE INDEX "_AlbumToMedia_B_index" ON "_AlbumToMedia"("B");

-- CreateIndex
CREATE INDEX "_ActualiteToMedia_B_index" ON "_ActualiteToMedia"("B");

-- CreateIndex
CREATE INDEX "_EvenementToMedia_B_index" ON "_EvenementToMedia"("B");

-- AddForeignKey
ALTER TABLE "communes" ADD CONSTRAINT "communes_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_galerieId_fkey" FOREIGN KEY ("galerieId") REFERENCES "galeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galerie_media" ADD CONSTRAINT "galerie_media_galerieId_fkey" FOREIGN KEY ("galerieId") REFERENCES "galeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "galerie_media" ADD CONSTRAINT "galerie_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_auteurId_fkey" FOREIGN KEY ("auteurId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "categories_actualite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actualites" ADD CONSTRAINT "actualites_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_secteurId_fkey" FOREIGN KEY ("secteurId") REFERENCES "secteurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_createurId_fkey" FOREIGN KEY ("createurId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "categories_document"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_actualiteId_fkey" FOREIGN KEY ("actualiteId") REFERENCES "actualites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_evenementId_fkey" FOREIGN KEY ("evenementId") REFERENCES "evenements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_actualiteId_fkey" FOREIGN KEY ("actualiteId") REFERENCES "actualites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evenements" ADD CONSTRAINT "evenements_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaires" ADD CONSTRAINT "partenaires_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "types_partenaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaire_projet" ADD CONSTRAINT "partenaire_projet_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaire_projet" ADD CONSTRAINT "partenaire_projet_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaire_programme" ADD CONSTRAINT "partenaire_programme_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partenaire_programme" ADD CONSTRAINT "partenaire_programme_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunites" ADD CONSTRAINT "opportunites_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "types_opportunite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunites" ADD CONSTRAINT "opportunites_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunites" ADD CONSTRAINT "opportunites_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "categories_faq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_secteurId_fkey" FOREIGN KEY ("secteurId") REFERENCES "secteurs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_communeId_fkey" FOREIGN KEY ("communeId") REFERENCES "communes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_departementId_fkey" FOREIGN KEY ("departementId") REFERENCES "departements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicateurs" ADD CONSTRAINT "indicateurs_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "programmes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reseaux_sociaux" ADD CONSTRAINT "reseaux_sociaux_partenaireId_fkey" FOREIGN KEY ("partenaireId") REFERENCES "partenaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjetMedia" ADD CONSTRAINT "_ProjetMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjetMedia" ADD CONSTRAINT "_ProjetMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "projets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPartenaire" ADD CONSTRAINT "_MediaToPartenaire_A_fkey" FOREIGN KEY ("A") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToPartenaire" ADD CONSTRAINT "_MediaToPartenaire_B_fkey" FOREIGN KEY ("B") REFERENCES "partenaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToMedia" ADD CONSTRAINT "_AlbumToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToMedia" ADD CONSTRAINT "_AlbumToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActualiteToMedia" ADD CONSTRAINT "_ActualiteToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "actualites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ActualiteToMedia" ADD CONSTRAINT "_ActualiteToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvenementToMedia" ADD CONSTRAINT "_EvenementToMedia_A_fkey" FOREIGN KEY ("A") REFERENCES "evenements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EvenementToMedia" ADD CONSTRAINT "_EvenementToMedia_B_fkey" FOREIGN KEY ("B") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;
