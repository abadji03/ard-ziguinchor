import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditEntry {
  userId?: string;
  userEmail: string;
  action: string;
  entite: string;
  entiteId?: string;
  details?: string;
  ip?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Enregistre une entrée de journal. Best-effort : une erreur d'audit
   * ne doit jamais faire échouer la requête métier.
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          userEmail: entry.userEmail,
          action: entry.action,
          entite: entry.entite,
          entiteId: entry.entiteId,
          details: entry.details,
          ip: entry.ip,
        },
      });
    } catch (err) {
      this.logger.error(`Échec de l'écriture du journal d'audit: ${err}`);
    }
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    action?: string;
    userEmail?: string;
  }) {
    const { page = 1, limit = 30, search, action, userEmail } = query;
    const where: Record<string, unknown> = {};

    if (action) where.action = action;
    if (userEmail) where.userEmail = userEmail;
    if (search) {
      where.OR = [
        { userEmail: { contains: search, mode: 'insensitive' } },
        { entite: { contains: search, mode: 'insensitive' } },
        { details: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
