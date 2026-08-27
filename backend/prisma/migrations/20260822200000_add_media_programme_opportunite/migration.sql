-- CreateTable
CREATE TABLE "_MediaToProgramme" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToProgramme_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MediaToOpportunite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaToOpportunite_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MediaToProgramme_B_index" ON "_MediaToProgramme"("B");

-- CreateIndex
CREATE INDEX "_MediaToOpportunite_B_index" ON "_MediaToOpportunite"("B");

-- AddForeignKey
ALTER TABLE "_MediaToProgramme" ADD CONSTRAINT "_MediaToProgramme_A_fkey" FOREIGN KEY ("A") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToProgramme" ADD CONSTRAINT "_MediaToProgramme_B_fkey" FOREIGN KEY ("B") REFERENCES "programmes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToOpportunite" ADD CONSTRAINT "_MediaToOpportunite_A_fkey" FOREIGN KEY ("A") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaToOpportunite" ADD CONSTRAINT "_MediaToOpportunite_B_fkey" FOREIGN KEY ("B") REFERENCES "opportunites"("id") ON DELETE CASCADE ON UPDATE CASCADE;