import { NotFoundException } from '@nestjs/common';
import { ActualitesService } from './actualites.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { GaleriesAutoSyncService } from '../../../galeries/services/galeries-auto-sync.service';

const actualite = {
  id: 'a1',
  titre: 'Une actualité',
  slug: 'une-actualite',
  resume: 'Résumé',
  contenu: 'Contenu',
  imagePrincipale: 'https://cdn.ex/img.jpg',
  datePublication: null as Date | null,
  createdAt: new Date(),
};

describe('ActualitesService', () => {
  let service: ActualitesService;
  let prisma: {
    actualite: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let galeriesAutoSync: { syncEntiteImage: jest.Mock };

  beforeEach(() => {
    prisma = {
      actualite: {
        findUnique: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn().mockResolvedValue([[], 0]),
    };
    galeriesAutoSync = { syncEntiteImage: jest.fn().mockResolvedValue(null) };

    service = new ActualitesService(
      prisma as unknown as PrismaService,
      galeriesAutoSync as unknown as GaleriesAutoSyncService,
    );
  });

  describe('findAll', () => {
    it('filtre par statut et recherche textuelle (OR sur titre/resume)', async () => {
      prisma.$transaction.mockResolvedValue([[actualite], 1]);

      const result = await service.findAll({
        statut: 'publie',
        q: 'ziguinchor',
      } as never);

      const findManyArg = prisma.actualite.findMany.mock.calls[0][0];
      expect(findManyArg.where).toMatchObject({
        statut: 'publie',
        OR: [
          { titre: { contains: 'ziguinchor', mode: 'insensitive' } },
          { resume: { contains: 'ziguinchor', mode: 'insensitive' } },
        ],
      });
      expect(result.meta.total).toBe(1);
    });

    it('applique skip/take selon page et limit', async () => {
      await service.findAll({ page: 3, limit: 5 } as never);
      const findManyArg = prisma.actualite.findMany.mock.calls[0][0];
      expect(findManyArg.skip).toBe(10); // (3 - 1) * 5
      expect(findManyArg.take).toBe(5);
    });

    it('utilise des valeurs par défaut page=1, limit=10', async () => {
      await service.findAll({} as never);
      const findManyArg = prisma.actualite.findMany.mock.calls[0][0];
      expect(findManyArg.skip).toBe(0);
      expect(findManyArg.take).toBe(10);
    });
  });

  describe('findOne', () => {
    it('retourne l\'actualité trouvée', async () => {
      prisma.actualite.findUnique.mockResolvedValue(actualite);
      const result = await service.findOne('a1');
      expect(result.id).toBe('a1');
    });

    it('lève NotFoundException si introuvable', async () => {
      prisma.actualite.findUnique.mockResolvedValue(null);
      await expect(service.findOne('nope')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('lève NotFoundException si le slug est inconnu', async () => {
      prisma.actualite.findUnique.mockResolvedValue(null);
      await expect(service.findBySlug('inconnu')).rejects.toThrow(
        'Actualité "inconnu" introuvable',
      );
    });
  });

  describe('create', () => {
    it('convertit datePublication en Date et synchronise la galerie si une image est fournie', async () => {
      const media = { id: 'm1' };
      prisma.actualite.create.mockResolvedValue({ ...actualite, id: 'a2' });
      galeriesAutoSync.syncEntiteImage.mockResolvedValue(media);

      await service.create({
        titre: 'Une actualité',
        slug: 'une-actualite',
        contenu: 'Contenu',
        imagePrincipale: 'https://cdn.ex/img.jpg',
        datePublication: '2026-08-31T10:00',
      } as never);

      const createArg = prisma.actualite.create.mock.calls[0][0];
      expect(createArg.data.datePublication).toBeInstanceOf(Date);
      expect(galeriesAutoSync.syncEntiteImage).toHaveBeenCalledWith(
        'Actualités',
        'galerie-auto-actualites',
        'https://cdn.ex/img.jpg',
        'Une actualité',
      );
      expect(prisma.actualite.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { medias: { connect: { id: 'm1' } } },
        }),
      );
    });

    it('ne synchronise pas la galerie sans image principale', async () => {
      prisma.actualite.create.mockResolvedValue({
        ...actualite,
        imagePrincipale: null,
      });

      await service.create({
        titre: 'Une actualité',
        slug: 'une-actualite',
        contenu: 'Contenu',
      } as never);

      expect(galeriesAutoSync.syncEntiteImage).not.toHaveBeenCalled();
      expect(prisma.actualite.update).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('lève NotFoundException si l\'actualité n\'existe pas', async () => {
      prisma.actualite.findUnique.mockResolvedValue(null);
      await expect(service.update('nope', {} as never)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('met à jour et resynchronise la galerie', async () => {
      prisma.actualite.findUnique.mockResolvedValue(actualite);
      prisma.actualite.update.mockResolvedValue(actualite);
      const media = { id: 'm2' };
      galeriesAutoSync.syncEntiteImage.mockResolvedValue(media);

      await service.update('a1', { titre: 'Nouveau titre' } as never);

      expect(prisma.actualite.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'a1' },
          data: expect.objectContaining({ titre: 'Nouveau titre' }),
        }),
      );
      expect(prisma.actualite.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { medias: { connect: { id: 'm2' } } },
        }),
      );
    });
  });

  describe('remove', () => {
    it('lève NotFoundException si introuvable', async () => {
      prisma.actualite.findUnique.mockResolvedValue(null);
      await expect(service.remove('nope')).rejects.toThrow(NotFoundException);
      expect(prisma.actualite.delete).not.toHaveBeenCalled();
    });

    it('supprime l\'actualité existante', async () => {
      prisma.actualite.findUnique.mockResolvedValue(actualite);
      prisma.actualite.delete.mockResolvedValue(actualite);
      const result = await service.remove('a1');
      expect(prisma.actualite.delete).toHaveBeenCalledWith({ where: { id: 'a1' } });
      expect(result.id).toBe('a1');
    });
  });
});
