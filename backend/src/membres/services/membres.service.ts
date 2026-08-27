import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryMembreDto } from '../dto/query-membre.dto';
import { CreateMembreDto } from '../dto/create-membre.dto';

@Injectable()
export class MembresService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryMembreDto) {
    const { page = 1, limit = 10, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { prenom: { contains: q, mode: 'insensitive' } },
        { fonction: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.membre.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ordre: 'asc' },
      }),
      this.prisma.membre.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const membre = await this.prisma.membre.findUnique({ where: { id } });
    if (!membre) throw new NotFoundException(`Membre #${id} introuvable`);
    return membre;
  }

  async create(data: CreateMembreDto) {
    return this.prisma.membre.create({
      data: data,
    });
  }

  async update(id: string, data: Partial<CreateMembreDto>) {
    await this.findOne(id);
    return this.prisma.membre.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.membre.delete({ where: { id } });
  }
}
