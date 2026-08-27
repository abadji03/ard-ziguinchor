import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryFaqDto } from '../dto/query-faq.dto';
import { CreateFaqDto } from '../dto/create-faq.dto';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryFaqDto) {
    const { page = 1, limit = 10, categorieId, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (categorieId) where.categorieId = categorieId;
    if (q) {
      where.OR = [
        { question: { contains: q, mode: 'insensitive' } },
        { reponse: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.faq.findMany({
        where,
        skip,
        take: limit,
        orderBy: { ordre: 'asc' },
        include: { categorie: true },
      }),
      this.prisma.faq.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const faq = await this.prisma.faq.findUnique({
      where: { id },
      include: { categorie: true },
    });
    if (!faq) throw new NotFoundException(`FAQ #${id} introuvable`);
    return faq;
  }

  async create(data: CreateFaqDto) {
    return this.prisma.faq.create({
      data: data as Parameters<typeof this.prisma.faq.create>[0]['data'],
      include: { categorie: true },
    });
  }

  async update(id: string, data: Partial<CreateFaqDto>) {
    await this.findOne(id);
    return this.prisma.faq.update({
      where: { id },
      data: data,
      include: { categorie: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.faq.delete({ where: { id } });
  }
}
