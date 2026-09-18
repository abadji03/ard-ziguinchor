import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryContenuDto } from '../dto/query-contenu.dto';
import { CreateContenuDto } from '../dto/create-contenu.dto';

/** Contenu éditorial indexé par type (réponse de `GET /contenus/section/:section`). */
export type ContenusParType = Record<string, unknown[]>;

@Injectable()
export class ContenusService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryContenuDto) {
    const { page = 1, limit = 50, q, type, section, actif, includeInactifs } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (section) where.section = section;
    // Par défaut seuls les blocs actifs sortent ; `includeInactifs` est réservé
    // à l'administration (Paramètres → Contenus & textes).
    if (includeInactifs) {
      if (actif !== undefined) where.actif = actif;
    } else {
      where.actif = actif ?? true;
    }
    if (q) {
      where.OR = [
        { titre: { contains: q, mode: 'insensitive' } },
        { sousTitre: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.contenuEditorial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ type: 'asc' }, { ordre: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.contenuEditorial.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  /** Tous les blocs actifs d'une page, regroupés par type. */
  async findBySection(section: string): Promise<ContenusParType> {
    const contenus = await this.prisma.contenuEditorial.findMany({
      where: { section, actif: true },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    });

    return contenus.reduce<ContenusParType>((acc, contenu) => {
      (acc[contenu.type] ??= []).push(contenu);
      return acc;
    }, {});
  }

  /** Blocs actifs d'un type donné (ex. DIRECTIONS pour un select de formulaire). */
  async findByType(type: string, section?: string) {
    return this.prisma.contenuEditorial.findMany({
      where: { type, actif: true, ...(section ? { section } : {}) },
      orderBy: [{ ordre: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findOne(id: string) {
    const contenu = await this.prisma.contenuEditorial.findUnique({
      where: { id },
    });
    if (!contenu) throw new NotFoundException(`Contenu #${id} introuvable`);
    return contenu;
  }

  async create(data: CreateContenuDto) {
    return this.prisma.contenuEditorial.create({
      data: { ...data, section: data.section || null },
    });
  }

  async update(id: string, data: Partial<CreateContenuDto>) {
    await this.findOne(id);
    return this.prisma.contenuEditorial.update({
      where: { id },
      data: { ...data, section: data.section === '' ? null : data.section },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.contenuEditorial.delete({ where: { id } });
  }
}
