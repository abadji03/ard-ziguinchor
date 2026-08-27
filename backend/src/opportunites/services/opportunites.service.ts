import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryOpportuniteDto } from '../dto/query-opportunite.dto';
import { CreateOpportuniteDto } from '../dto/create-opportunite.dto';

@Injectable()
export class OpportunitesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryOpportuniteDto) {
    const { page = 1, limit = 10, statut, typeId, partenaireId, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (typeId) where.typeId = typeId;
    if (partenaireId) where.partenaireId = partenaireId;
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { resume: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.opportunite.findMany({
        where,
        skip,
        take: limit,
        orderBy: { datePublication: 'desc' },
        include: {
          type: true,
          partenaire: { select: { id: true, nom: true, sigle: true } },
        },
      }),
      this.prisma.opportunite.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const opportunite = await this.prisma.opportunite.findUnique({
      where: { id },
      include: {
        type: true,
        partenaire: true,
        document: true,
      },
    });
    if (!opportunite)
      throw new NotFoundException(`Opportunité #${id} introuvable`);
    return opportunite;
  }

  async findBySlug(slug: string) {
    const opportunite = await this.prisma.opportunite.findUnique({
      where: { slug },
      include: {
        type: true,
        partenaire: true,
        document: true,
      },
    });
    if (!opportunite)
      throw new NotFoundException(`Opportunité "${slug}" introuvable`);
    return opportunite;
  }

  async create(data: CreateOpportuniteDto) {
    const { dateLimite, documentId, ...rest } = data;
    const createData: Record<string, unknown> = { ...rest };
    if (dateLimite) createData.dateLimite = new Date(dateLimite);
    if (documentId) createData.documentId = documentId;
    return this.prisma.opportunite.create({
      data: createData as Parameters<
        typeof this.prisma.opportunite.create
      >[0]['data'],
      include: { type: true },
    });
  }

  async update(id: string, data: Partial<CreateOpportuniteDto>) {
    await this.findOne(id);
    const { dateLimite, documentId, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dateLimite) updateData.dateLimite = new Date(dateLimite);
    if (documentId) updateData.documentId = documentId;
    return this.prisma.opportunite.update({
      where: { id },
      data: updateData,
      include: { type: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.opportunite.delete({ where: { id } });
  }
}
