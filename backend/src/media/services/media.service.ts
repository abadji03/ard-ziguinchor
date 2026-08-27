import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryMediaDto } from '../dto/query-media.dto';
import { CreateMediaDto } from '../dto/create-media.dto';

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryMediaDto) {
    const { page = 1, limit = 10, type, format, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (type) where.type = type;
    if (format) where.format = format;
    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { legende: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.media.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException(`Média #${id} introuvable`);
    return media;
  }

  async create(data: CreateMediaDto) {
    return this.prisma.media.create({
      data: data,
    });
  }

  async update(id: string, data: Partial<CreateMediaDto>) {
    await this.findOne(id);
    return this.prisma.media.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.media.delete({ where: { id } });
  }
}
