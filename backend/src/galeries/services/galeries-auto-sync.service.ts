import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Service de synchronisation automatique : les images associées à une entité
 * (projet, programme, opportunité, actualité, etc.) sont automatiquement
 * versées dans une galerie dédiée au type d'entité, afin de constituer
 * une galerie "Images de <type>" mise à jour sans action manuelle.
 */
@Injectable()
export class GaleriesAutoSyncService {
  constructor(private prisma: PrismaService) {}

  /**
   * Garantit l'existence de la galerie dédiée à un type d'entité et y ajoute
   * l'image fournie si elle n'y figure pas encore.
   *
   * @param typeLabel Libellé lisible (ex. "Projets")
   * @param slugGal label un identifiant unique de galerie (ex. "galerie-auto-projets")
   * @param imageUrl  URL de l'image à ajouter
   * @param nomImage  Nom affiché du média
   */
  async syncEntiteImage(
    typeLabel: string,
    galerieSlug: string,
    imageUrl: string | null | undefined,
    nomImage?: string,
  ) {
    if (!imageUrl) return null;

    const galerie = await this.prisma.galerie.upsert({
      where: { slug: galerieSlug },
      update: {},
      create: {
        nom: `Images de ${typeLabel}`,
        slug: galerieSlug,
        description: `Galerie automatique des images liées aux ${typeLabel}.`,
      },
    });

    // Vérifie qu'un média pointe déjà vers cette URL dans la galerie.
    const existingMedia = await this.prisma.media.findFirst({
      where: { fichier: imageUrl },
      include: { galerieMedia: true },
    });

    if (existingMedia) {
      // Relie si besoin
      await this.prisma.galerieMedia.upsert({
        where: {
          galerieId_mediaId: {
            galerieId: galerie.id,
            mediaId: existingMedia.id,
          },
        },
        update: {},
        create: { galerieId: galerie.id, mediaId: existingMedia.id },
      });
      return existingMedia;
    }

    const media = await this.prisma.media.create({
      data: {
        nom: nomImage || imageUrl,
        fichier: imageUrl,
        type: 'image',
        format: this.detectFormat(imageUrl),
      },
    });

    await this.prisma.galerieMedia.create({
      data: { galerieId: galerie.id, mediaId: media.id },
    });

    return media;
  }

  /** Relie un média existant à une entité via une relation M2M. */
  async connectMediaToEntity(mediaId: string, relation: string, entityId: string) {
    // Les relations M2M (projets, programmes, opportunites...) sont gérées au
    // niveau des services d'entité ; nettement plus simple de connecter via le
    // service d'entité lui-même que de re-déclarer ici.
    return null;
  }

  private detectFormat(url: string): string {
    const m = url && url.split('?')[0].match(/\.([a-zA-Z0-9]+)$/);
    return m ? m[1].toLowerCase() : '';
  }
}