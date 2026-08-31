import { RechercheService } from './recherche.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RechercheService', () => {
  let service: RechercheService;
  let prisma: Record<string, { findMany: jest.Mock }>;

  const ENTITES = [
    'actualite',
    'projet',
    'programme',
    'document',
    'opportunite',
    'partenaire',
    'evenement',
    'faq',
    'indicateur',
  ];

  beforeEach(() => {
    prisma = {};
    for (const entite of ENTITES) {
      prisma[entite] = {
        findMany: jest.fn().mockResolvedValue([]),
      };
    }
    service = new RechercheService(prisma as unknown as PrismaService);
  });

  it('interroge toutes les entités avec la condition insensible à la casse', async () => {
    await service.searchAll('ziguinchor');

    for (const entite of ENTITES) {
      expect(prisma[entite].findMany).toHaveBeenCalledTimes(1);
      const arg = prisma[entite].findMany.mock.calls[0][0];
      // Chaque entité doit chercher avec mode insensitive
      const whereOR = arg.where.OR as Array<Record<string, { mode: string }>>;
      expect(whereOR.length).toBeGreaterThan(0);
      for (const clause of whereOR) {
        const field = Object.values(clause)[0] as { mode: string; contains: string };
        expect(field.mode).toBe('insensitive');
        expect(field.contains).toBe('ziguinchor');
      }
      // Limite de 20 résultats par entité
      expect(arg.take).toBe(20);
    }
  });

  it('calcule le total comme la somme des résultats par entité', async () => {
    prisma.actualite.findMany.mockResolvedValue([{ id: '1' }, { id: '2' }]);
    prisma.projet.findMany.mockResolvedValue([{ id: '3' }]);
    prisma.faq.findMany.mockResolvedValue([{ id: '4' }, { id: '5' }, { id: '6' }]);

    const result = await service.searchAll('test');

    expect(result.actualites).toHaveLength(2);
    expect(result.projets).toHaveLength(1);
    expect(result.faqs).toHaveLength(3);
    expect(result.total).toBe(6);
  });

  it('retourne un total de 0 quand aucune entité ne correspond', async () => {
    const result = await service.searchAll('rien-existe');
    expect(result.total).toBe(0);
  });
});
