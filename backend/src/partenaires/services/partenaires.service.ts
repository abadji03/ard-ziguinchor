import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryPartenaireDto } from '../dto/query-partenaire.dto';
import { CreatePartenaireDto } from '../dto/create-partenaire.dto';

@Injectable()
export class PartenairesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryPartenaireDto) {
    const { page = 1, limit = 10, statut, typeId, pays, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (statut) where.statut = statut;
    if (typeId) where.typeId = typeId;
    if (pays) where.pays = pays;
    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { sigle: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.partenaire.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nom: 'asc' },
        include: { type: true },
      }),
      this.prisma.partenaire.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const partenaire = await this.prisma.partenaire.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!partenaire)
      throw new NotFoundException(`Partenaire #${id} introuvable`);
    return partenaire;
  }

  async findBySlug(slug: string) {
    const partenaire = await this.prisma.partenaire.findUnique({
      where: { slug },
      include: { type: true },
    });
    if (!partenaire)
      throw new NotFoundException(`Partenaire "${slug}" introuvable`);
    return partenaire;
  }

  async create(data: CreatePartenaireDto) {
    const { dateDebutPartenariat, ...rest } = data;
    const createData: Record<string, unknown> = { ...rest };
    if (dateDebutPartenariat)
      createData.dateDebutPartenariat = new Date(dateDebutPartenariat);
    return this.prisma.partenaire.create({
      data: createData as Parameters<
        typeof this.prisma.partenaire.create
      >[0]['data'],
      include: { type: true },
    });
  }

  async update(id: string, data: Partial<CreatePartenaireDto>) {
    await this.findOne(id);
    const { dateDebutPartenariat, ...rest } = data;
    const updateData: Record<string, unknown> = { ...rest };
    if (dateDebutPartenariat)
      updateData.dateDebutPartenariat = new Date(dateDebutPartenariat);
    return this.prisma.partenaire.update({
      where: { id },
      data: updateData,
      include: { type: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.partenaire.delete({ where: { id } });
  }
}
