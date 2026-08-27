import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RechercheService {
  constructor(private prisma: PrismaService) {}

  async searchAll(query: string) {
    const searchCondition = {
      contains: query,
      mode: 'insensitive' as Prisma.QueryMode,
    };

    const [
      actualites,
      projets,
      programmes,
      documents,
      opportunites,
      partenaires,
      evenements,
      faqs,
      indicateurs,
    ] = await Promise.all([
      this.prisma.actualite.findMany({
        where: {
          OR: [
            { titre: searchCondition },
            { resume: searchCondition },
            { contenu: searchCondition },
          ],
        },
        select: {
          id: true,
          titre: true,
          slug: true,
          resume: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.projet.findMany({
        where: {
          OR: [
            { titre: searchCondition },
            { resume: searchCondition },
            { description: searchCondition },
          ],
        },
        select: {
          id: true,
          titre: true,
          slug: true,
          resume: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.programme.findMany({
        where: {
          OR: [
            { nom: searchCondition },
            { resume: searchCondition },
            { description: searchCondition },
          ],
        },
        select: {
          id: true,
          nom: true,
          slug: true,
          resume: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.document.findMany({
        where: {
          OR: [{ titre: searchCondition }, { resume: searchCondition }],
        },
        select: {
          id: true,
          titre: true,
          slug: true,
          resume: true,
          format: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.opportunite.findMany({
        where: {
          OR: [{ titre: searchCondition }, { description: searchCondition }],
        },
        select: {
          id: true,
          titre: true,
          slug: true,
          resume: true,
          typeId: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.partenaire.findMany({
        where: {
          OR: [
            { nom: searchCondition },
            { sigle: searchCondition },
            { description: searchCondition },
          ],
        },
        select: {
          id: true,
          nom: true,
          slug: true,
          sigle: true,
          logo: true,
        },
        orderBy: { nom: 'asc' },
        take: 20,
      }),
      this.prisma.evenement.findMany({
        where: {
          OR: [
            { titre: searchCondition },
            { resume: searchCondition },
            { description: searchCondition },
            { lieu: searchCondition },
          ],
        },
        select: {
          id: true,
          titre: true,
          slug: true,
          resume: true,
          dateDebut: true,
        },
        orderBy: { dateDebut: 'desc' },
        take: 20,
      }),
      this.prisma.faq.findMany({
        where: {
          OR: [{ question: searchCondition }, { reponse: searchCondition }],
        },
        select: {
          id: true,
          question: true,
          reponse: true,
        },
        orderBy: { ordre: 'asc' },
        take: 20,
      }),
      this.prisma.indicateur.findMany({
        where: {
          OR: [{ nom: searchCondition }, { description: searchCondition }],
        },
        select: {
          id: true,
          nom: true,
          slug: true,
          valeur: true,
          unite: true,
          annee: true,
        },
        orderBy: { annee: 'desc' },
        take: 20,
      }),
    ]);

    return {
      actualites,
      projets,
      programmes,
      documents,
      opportunites,
      partenaires,
      evenements,
      faqs,
      indicateurs,
      total:
        actualites.length +
        projets.length +
        programmes.length +
        documents.length +
        opportunites.length +
        partenaires.length +
        evenements.length +
        faqs.length +
        indicateurs.length,
    };
  }
}
