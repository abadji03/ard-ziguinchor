import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryIndicateurDto } from '../dto/query-indicateur.dto';
import { CreateIndicateurDto } from '../dto/create-indicateur.dto';

@Injectable()
export class IndicateursService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryIndicateurDto) {
    const {
      page = 1,
      limit = 10,
      secteurId,
      communeId,
      departementId,
      projetId,
      programmeId,
      annee,
      q,
    } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (secteurId) where.secteurId = secteurId;
    if (communeId) where.communeId = communeId;
    if (departementId) where.departementId = departementId;
    if (projetId) where.projetId = projetId;
    if (programmeId) where.programmeId = programmeId;
    if (annee) {
      const year = parseInt(annee, 10);
      if (!isNaN(year)) where.annee = year;
    }
    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.indicateur.findMany({
        where,
        skip,
        take: limit,
        orderBy: { annee: 'desc' },
        include: { secteur: true, commune: true, departement: true },
      }),
      this.prisma.indicateur.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const indicateur = await this.prisma.indicateur.findUnique({
      where: { id },
      include: { secteur: true, commune: true, departement: true },
    });
    if (!indicateur)
      throw new NotFoundException(`Indicateur #${id} introuvable`);
    return indicateur;
  }

  async create(data: CreateIndicateurDto) {
    return this.prisma.indicateur.create({
      data: data as Parameters<typeof this.prisma.indicateur.create>[0]['data'],
      include: { secteur: true, commune: true, departement: true },
    });
  }

  async update(id: string, data: Partial<CreateIndicateurDto>) {
    await this.findOne(id);
    return this.prisma.indicateur.update({
      where: { id },
      data: data,
      include: { secteur: true, commune: true, departement: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.indicateur.delete({ where: { id } });
  }

  async getBySecteur(secteurId: string) {
    return this.prisma.indicateur.findMany({
      where: { secteurId },
      orderBy: { annee: 'desc' },
    });
  }

  async getByCommune(communeId: string) {
    return this.prisma.indicateur.findMany({
      where: { communeId },
      orderBy: { annee: 'desc' },
    });
  }
}
