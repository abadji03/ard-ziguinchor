import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { paginate } from '../../common/dto/pagination.dto';
import { QueryGalerieDto } from '../dto/query-galerie.dto';
import { CreateGalerieDto } from '../dto/create-galerie.dto';

@Injectable()
export class GaleriesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async findAll(query: QueryGalerieDto) {
    const { page = 1, limit = 10, q } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (q) {
      where.OR = [
        { nom: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.galerie.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          albums: {
            include: { medias: true },
            orderBy: { ordre: 'asc' },
          },
          galerieMedias: {
            include: { media: true },
            orderBy: { ordre: 'asc' },
          },
        },
      }),
      this.prisma.galerie.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string) {
    const galerie = await this.prisma.galerie.findUnique({
      where: { id },
      include: {
        albums: {
          include: { medias: true },
          orderBy: { ordre: 'asc' },
        },
        galerieMedias: {
          include: { media: true },
          orderBy: { ordre: 'asc' },
        },
      },
    });
    if (!galerie) throw new NotFoundException(`Galerie #${id} introuvable`);
    return galerie;
  }

  async create(data: CreateGalerieDto) {
    return this.prisma.galerie.create({
      data: data as Parameters<typeof this.prisma.galerie.create>[0]['data'],
      include: {
        albums: { include: { medias: true } },
        galerieMedias: { include: { media: true } },
      },
    });
  }

  async update(id: string, data: Partial<CreateGalerieDto>) {
    await this.findOne(id);
    return this.prisma.galerie.update({
      where: { id },
      data: data,
      include: {
        albums: { include: { medias: true } },
        galerieMedias: { include: { media: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.galerie.delete({ where: { id } });
  }

  // ─── Gestion des médias ─────────────────────────────────────────────────────

  /**
   * Upload une image sur Cloudinary et l'ajoute comme média à la galerie.
   */
  async addMedia(
    galerieId: string,
    file: Express.Multer.File,
    meta: { texteAlt?: string; legende?: string } = {},
  ) {
    await this.findOne(galerieId);

    // Upload sur Cloudinary
    const uploaded = await this.cloudinary.uploadImage(file);

    // Crée l'entrée Media
    const media = await this.prisma.media.create({
      data: {
        nom: file.originalname || uploaded.public_id,
        fichier: uploaded.secure_url,
        type: 'image',
        format: (file.originalname?.split('.').pop() ?? '').toLowerCase() || '',
        taille: file.size ?? null,
        texteAlt: meta.texteAlt ?? null,
        legende: meta.legende ?? null,
      },
    });

    // Relie à la galerie via GalerieMedia
    await this.prisma.galerieMedia.create({
      data: { galerieId, mediaId: media.id },
    });

    return media;
  }

  /**
   * Ajoute un média depuis une URL externe (image ou vidéo) à la galerie.
   * Pas d'upload Cloudinary — l'URL est stockée telle quelle.
   */
  async addMediaFromUrl(
    galerieId: string,
    data: {
      url: string;
      nom?: string;
      type?: string;
      texteAlt?: string;
      legende?: string;
    },
  ) {
    await this.findOne(galerieId);

    // Détecte si c'est une vidéo (YouTube, Vimeo, .mp4, etc.)
    const isVideo =
      data.type === 'video' ||
      /youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.webm|\.ogg/i.test(data.url);

    const ext = data.url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/)?.[1]?.toLowerCase() ?? '';

    const media = await this.prisma.media.create({
      data: {
        nom: data.nom || data.url,
        fichier: data.url,
        type: isVideo ? 'video' : 'image',
        format: ext,
        texteAlt: data.texteAlt ?? null,
        legende: data.legende ?? null,
      },
    });

    await this.prisma.galerieMedia.create({
      data: { galerieId, mediaId: media.id },
    });

    return media;
  }

  /**
   * Retire un média de la galerie (supprime la liaison GalerieMedia + le Media).
   */
  async removeMedia(galerieId: string, mediaId: string) {
    await this.findOne(galerieId);

    // Supprime le lien
    await this.prisma.galerieMedia.deleteMany({
      where: { galerieId, mediaId },
    });

    // Vérifie si le média est encore utilisé ailleurs avant de le supprimer
    const usageCount = await this.prisma.galerieMedia.count({
      where: { mediaId },
    });
    if (usageCount === 0) {
      const media = await this.prisma.media.findUnique({ where: { id: mediaId } });
      if (media) {
        // Supprime sur Cloudinary (best effort)
        const publicId = media.fichier.split('/').pop()?.split('.')[0];
        if (publicId) {
          await this.cloudinary.deleteImage(`ard-ziguinchor/${publicId}`).catch(() => null);
        }
        await this.prisma.media.delete({ where: { id: mediaId } });
      }
    }

    return { success: true };
  }
}
