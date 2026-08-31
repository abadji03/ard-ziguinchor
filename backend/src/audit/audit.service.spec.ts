import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuditService', () => {
  let service: AuditService;
  let prisma: { auditLog: { create: jest.Mock; findMany: jest.Mock; count: jest.Mock }; $transaction: jest.Mock };

  beforeEach(() => {
    prisma = {
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
      },
      $transaction: jest.fn().mockResolvedValue([[], 0]),
    };
    service = new AuditService(prisma as unknown as PrismaService);
  });

  it('enregistre une entrée de journal avec toutes les informations', async () => {
    await service.log({
      userId: 'u1',
      userEmail: 'admin@ard.sn',
      action: 'CONNEXION',
      entite: 'auth',
      ip: '127.0.0.1',
    });

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'u1',
        userEmail: 'admin@ard.sn',
        action: 'CONNEXION',
        entite: 'auth',
        ip: '127.0.0.1',
      }),
    });
  });

  it('ne propage pas l\'erreur si l\'écriture du journal échoue (best-effort)', async () => {
    prisma.auditLog.create.mockRejectedValue(new Error('DB down'));
    await expect(
      service.log({ userEmail: 'a@b.c', action: 'CREATION', entite: 'actualites' }),
    ).resolves.toBeUndefined();
  });

  it('filtre le journal par action et recherche', async () => {
    await service.findAll({ action: 'CONNEXION', search: 'admin' } as never);
    const where = prisma.auditLog.findMany.mock.calls[0][0].where;
    expect(where.action).toBe('CONNEXION');
    expect(where.OR.some((c: Record<string, unknown>) => 'userEmail' in c)).toBe(true);
  });
});
