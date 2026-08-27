import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryEvenementDto } from '../dto/query-evenement.dto';
import { CreateEvenementDto } from '../dto/create-evenement.dto';

@Injectable()
export class EvenementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryEvenementDto) {
    const {
      page = 1,
      limit = 10,
      statut,
      programmeId,
      projetId,
      partenaireId,
      q,
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (programmeId) where.programmeId = programmeId;
    if (projetId) where.projetId = projetId;
    if (partenaireId) where.partenaireId = partenaireId;
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.evenement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dateDebut: 'asc' },
        include: {
          programme: { select: { id: true, nom: true, slug: true } },
          projet: { select: { id: true, titre: true, slug: true } },
          partenaire: { select: { id: true, nom: true, sigle: true } },
        },
      }),
      this.prisma.evenement.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const evenement = await this.prisma.evenement.findUnique({
      where: { id },
      include: {
        programme: true,
        projet: true,
        partenaire: true,
        documents: true,
        medias: true,
      },
    });
    if (!evenement) throw new NotFoundException(`Événement #${id} introuvable`);
    return evenement;
  }

  async findBySlug(slug: string) {
    const evenement = await this.prisma.evenement.findUnique({
      where: { slug },
      include: {
        programme: true,
        projet: true,
        partenaire: true,
      },
    });
    if (!evenement)
      throw new NotFoundException(`Événement "${slug}" introuvable`);
    return evenement;
  }

  async create(data: CreateEvenementDto) {
    const { dateDebut, dateFin, ...rest } = data;
    const createData: Record<string, unknown> = { ...rest };
    if (dateDebut) createData.dateDebut = new Date(dateDebut);
    if (dateFin) createData.dateFin = new Date(dateFin);
    return this.prisma.evenement.create({
      data: createData as Parameters<
        typeof this.prisma.evenement.create
      >[0]['data'],
    });
  }

  async update(id: string, data: Partial<CreateEvenementDto>) {
    await this.findOne(id);
    const { dateDebut, dateFin, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dateDebut) updateData.dateDebut = new Date(dateDebut);
    if (dateFin) updateData.dateFin = new Date(dateFin);
    return this.prisma.evenement.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.evenement.delete({ where: { id } });
  }
}
