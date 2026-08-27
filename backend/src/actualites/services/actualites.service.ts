import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GaleriesAutoSyncService } from '../../galeries/services/galeries-auto-sync.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryActualiteDto } from '../dto/query-actualite.dto';
import { CreateActualiteDto } from '../dto/create-actualite.dto';

@Injectable()
export class ActualitesService {
  constructor(
    private prisma: PrismaService,
    private galeriesAutoSync: GaleriesAutoSyncService,
  ) {}

  async findAll(query: QueryActualiteDto) {
    const { page = 1, limit = 10, statut, categorieId, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (categorieId) where.categorieId = categorieId;
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.actualite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          categorie: true,
          auteur: { select: { id: true, nom: true, prenom: true } },
        },
      }),
      this.prisma.actualite.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const actualite = await this.prisma.actualite.findUnique({
      where: { id },
      include: {
        categorie: true,
        auteur: { select: { id: true, nom: true, prenom: true } },
        documents: true,
        medias: true,
      },
    });
    if (!actualite) throw new NotFoundException(`Actualité #${id} introuvable`);
    return actualite;
  }

  async findBySlug(slug: string) {
    const actualite = await this.prisma.actualite.findUnique({
      where: { slug },
      include: {
        categorie: true,
        auteur: { select: { id: true, nom: true, prenom: true } },
        documents: true,
        medias: true,
      },
    });
    if (!actualite)
      throw new NotFoundException(`Actualité "${slug}" introuvable`);
    return actualite;
  }

  async create(data: CreateActualiteDto) {
    const { datePublication, imagePrincipale, ...rest } = data;
    const actualite = await this.prisma.actualite.create({
      data: {
        ...rest,
        imagePrincipale: imagePrincipale ?? undefined,
        datePublication: datePublication
          ? new Date(datePublication)
          : undefined,
      },
      include: { categorie: true },
    });

    if (actualite.imagePrincipale) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Actualités',
        'galerie-auto-actualites',
        actualite.imagePrincipale,
        actualite.titre,
      );
      if (media) {
        await this.prisma.actualite.update({
          where: { id: actualite.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return actualite;
  }

  async update(id: string, data: Partial<CreateActualiteDto>) {
    await this.findOne(id);
    const { datePublication, ...rest } = data;
    const updated = await this.prisma.actualite.update({
      where: { id },
      data: {
        ...rest,
        datePublication: datePublication ? new Date(datePublication) : undefined,
      },
      include: { categorie: true },
    });

    // Sync galerie si une image est présente (nouvelle ou existante)
    if (updated.imagePrincipale) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Actualités',
        'galerie-auto-actualites',
        updated.imagePrincipale,
        updated.titre,
      );
      if (media) {
        await this.prisma.actualite.update({
          where: { id: updated.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.actualite.delete({ where: { id } });
  }
}
