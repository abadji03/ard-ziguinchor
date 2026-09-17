import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GaleriesAutoSyncService } from '../../galeries/services/galeries-auto-sync.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryProjetDto } from '../dto/query-projet.dto';
import { CreateProjetDto } from '../dto/create-projet.dto';

@Injectable()
export class ProjetsService {
  constructor(
    private prisma: PrismaService,
    private galeriesAutoSync: GaleriesAutoSyncService,
  ) {}

  async findAll(query: QueryProjetDto) {
    const {
      page = 1,
      limit = 10,
      statut,
      secteurId,
      departementId,
      communeId,
      programmeId,
      partenaireId,
      annee,
      q,
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (secteurId) where.secteurId = secteurId;
    if (departementId) where.departementId = departementId;
    if (communeId) where.communeId = communeId;
    if (programmeId) where.programmeId = programmeId;
    if (annee) {
      const year = parseInt(annee, 10);
      if (!isNaN(year)) {
        where.OR = [
          {
            dateDebut: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(`${year}-12-31`),
            },
          },
          {
            dateFin: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(`${year}-12-31`),
            },
          },
        ];
      }
    }
    if (partenaireId) {
      where.partenaires = { some: { partenaireId } };
    }
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.projet.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          secteur: true,
          departement: true,
          commune: true,
          programme: {
            select: { id: true, nom: true, acronyme: true, slug: true },
          },
          createur: { select: { id: true, nom: true, prenom: true } },
          partenaires: {
            include: {
              partenaire: {
                select: { id: true, nom: true, sigle: true, logo: true },
              },
            },
          },
        },
      }),
      this.prisma.projet.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const projet = await this.prisma.projet.findUnique({
      where: { id },
      include: {
        secteur: true,
        departement: true,
        commune: true,
        programme: true,
        createur: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
        partenaires: {
          include: {
            partenaire: true,
          },
        },
        documents: true,
        indicateurs: true,
        actualites: { select: { id: true, titre: true, slug: true } },
        evenements: { select: { id: true, titre: true, slug: true } },
      },
    });
    if (!projet) throw new NotFoundException(`Projet #${id} introuvable`);
    return projet;
  }

  async findBySlug(slug: string) {
    const projet = await this.prisma.projet.findUnique({
      where: { slug },
      include: {
        secteur: true,
        departement: true,
        commune: true,
        programme: true,
        partenaires: { include: { partenaire: true } },
        documents: true,
      },
    });
    if (!projet) throw new NotFoundException(`Projet "${slug}" introuvable`);
    return projet;
  }

  async create(data: CreateProjetDto) {
    const { dateDebut, dateFin, imagePrincipale, documentId, partenaireIds, partenairesRole, ...rest } = data;
    const projet = await this.prisma.projet.create({
      data: {
        ...rest,
        imagePrincipale: imagePrincipale ?? undefined,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin: dateFin ? new Date(dateFin) : undefined,
        documents: documentId ? { connect: { id: documentId } } : undefined,
        partenaires: partenaireIds?.length
          ? { create: partenaireIds.map((partenaireId) => ({ partenaireId, role: partenairesRole })) }
          : undefined,
      },
      include: {
        secteur: true,
        departement: true,
        commune: true,
      },
    });

    if (projet.imagePrincipale) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Projets',
        'galerie-auto-projets',
        projet.imagePrincipale,
        projet.titre,
      );
      if (media) {
        await this.prisma.projet.update({
          where: { id: projet.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return projet;
  }

  async update(id: string, data: Partial<CreateProjetDto>) {
    await this.findOne(id);
    const { dateDebut, dateFin, documentId, partenaireIds, partenairesRole, ...rest } = data;
    const updated = await this.prisma.projet.update({
      where: { id },
      data: {
        ...rest,
        dateDebut: dateDebut ? new Date(dateDebut) : undefined,
        dateFin:   dateFin   ? new Date(dateFin)   : undefined,
        documents: documentId ? { connect: { id: documentId } } : undefined,
        // Remplacement complet des liens partenaires si le champ est fourni
        partenaires: Array.isArray(partenaireIds)
          ? {
              deleteMany: {},
              create: partenaireIds.map((partenaireId) => ({ partenaireId, role: partenairesRole })),
            }
          : undefined,
      },
      include: { secteur: true, departement: true, commune: true },
    });

    // Sync galerie si une image est présente (nouvelle ou existante)
    if (updated.imagePrincipale) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Projets',
        'galerie-auto-projets',
        updated.imagePrincipale,
        updated.titre,
      );
      if (media) {
        await this.prisma.projet.update({
          where: { id: updated.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.projet.delete({ where: { id } });
  }
}
