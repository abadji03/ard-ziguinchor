import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GaleriesAutoSyncService } from '../../galeries/services/galeries-auto-sync.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryProgrammeDto } from '../dto/query-programme.dto';
import { CreateProgrammeDto } from '../dto/create-programme.dto';

@Injectable()
export class ProgrammesService {
  constructor(
    private prisma: PrismaService,
    private galeriesAutoSync: GaleriesAutoSyncService,
  ) {}

  async findAll(query: QueryProgrammeDto) {
    const { page = 1, limit = 10, statut, partenaireId, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (partenaireId) {
      where.partenaires = { some: { partenaireId } };
    }
    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.programme.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateDebut: 'desc' },
        include: {
          projets: {
            select: {
              id: true,
              titre: true,
              slug: true,
              statut: true,
              secteur: { select: { id: true, nom: true } },
            },
          },
        },
      }),
      this.prisma.programme.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { id },
      include: {
        projets: {
          include: {
            secteur: true,
            departement: true,
            commune: true,
          },
        },
        partenaires: {
          include: {
            partenaire: true,
          },
        },
        documents: true,
        evenements: true,
      },
    });
    if (!programme) throw new NotFoundException(`Programme #${id} introuvable`);
    return programme;
  }

  async findBySlug(slug: string) {
    const programme = await this.prisma.programme.findUnique({
      where: { slug },
      include: {
        projets: true,
        documents: true,
      },
    });
    if (!programme)
      throw new NotFoundException(`Programme "${slug}" introuvable`);
    return programme;
  }

  async create(data: CreateProgrammeDto) {
    const { dateDebut, dateFin, image, documentId, ...rest } = data;
    const createData: Record<string, unknown> = { ...rest, image: image ?? undefined };
    if (dateDebut) createData.dateDebut = new Date(dateDebut);
    if (dateFin) createData.dateFin = new Date(dateFin);
    if (documentId) createData.documents = { connect: { id: documentId } };
    const programme = await this.prisma.programme.create({
      data: createData as Parameters<
        typeof this.prisma.programme.create
      >[0]['data'],
      include: {
        projets: true,
      },
    });

    if (programme.image) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Programmes',
        'galerie-auto-programmes',
        programme.image,
        programme.nom,
      );
      if (media) {
        await this.prisma.programme.update({
          where: { id: programme.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return programme;
  }

  async update(id: string, data: Partial<CreateProgrammeDto>) {
    await this.findOne(id);
    const { dateDebut, dateFin, documentId, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dateDebut) updateData.dateDebut = new Date(dateDebut);
    if (dateFin)   updateData.dateFin   = new Date(dateFin);
    if (documentId) updateData.documents = { connect: { id: documentId } };

    const updated = await this.prisma.programme.update({
      where: { id },
      data: updateData,
      include: { projets: true },
    });

    // Sync galerie si une image est présente (nouvelle ou existante)
    if (updated.image) {
      const media = await this.galeriesAutoSync.syncEntiteImage(
        'Programmes',
        'galerie-auto-programmes',
        updated.image,
        updated.nom,
      );
      if (media) {
        await this.prisma.programme.update({
          where: { id: updated.id },
          data: { medias: { connect: { id: media.id } } },
        });
      }
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.programme.delete({ where: { id } });
  }
}
