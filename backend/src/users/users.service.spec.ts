import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

const user = {
  id: 'u1',
  email: 'redacteur@ard.sn',
  nom: 'Sow',
  prenom: 'Fatou',
  poste: 'Journaliste',
  telephone: null,
  role: 'REDACTEUR' as const,
  actif: true,
  dernierLogin: null,
  createdAt: new Date(),
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        create: jest.fn(),
        update: jest.fn().mockResolvedValue(user),
        delete: jest.fn(),
      },
      $transaction: jest.fn().mockResolvedValue([[], 0]),
    };
    service = new UsersService(prisma as unknown as PrismaService);
  });

  it('crée un utilisateur avec mot de passe hashé et rôle par défaut', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);

    await service.create({
      email: 'redacteur@ard.sn',
      password: 'motdepasse123',
      nom: 'Sow',
      prenom: 'Fatou',
    });

    const data = prisma.user.create.mock.calls[0][0].data;
    expect(data.password).not.toBe('motdepasse123');
    expect(data.role).toBe('REDACTEUR');
  });

  it('lève ConflictException si l\'email existe déjà', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    await expect(
      service.create({ email: 'redacteur@ard.sn', password: 'x'.repeat(10), nom: 'S', prenom: 'F' }),
    ).rejects.toThrow(ConflictException);
  });

  it('lève NotFoundException à la modification d\'un utilisateur inconnu', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.update('nope', { nom: 'X' })).rejects.toThrow(NotFoundException);
  });

  it('réinitialise le mot de passe (action admin uniquement)', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    await service.resetPassword('u1', { password: 'nouveaumdp123' });
    const data = prisma.user.update.mock.calls[0][0].data;
    expect(data.password).not.toBe('nouveaumdp123');
    // vérification optionnelle : le hash correspond au nouveau mot de passe
    expect(bcrypt.compareSync('nouveaumdp123', data.password)).toBe(true);
  });

  it('refuse la suppression de son propre compte', async () => {
    await expect(service.remove('u1', 'u1')).rejects.toThrow(BadRequestException);
    expect(prisma.user.delete).not.toHaveBeenCalled();
  });

  it('supprime un autre utilisateur existant', async () => {
    prisma.user.findUnique.mockResolvedValue(user);
    await service.remove('u2', 'u1');
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u2' } });
  });

  it('filtre la liste par recherche et rôle', async () => {
    await service.findAll({ search: 'fatou', role: 'REDACTEUR' } as never);
    const where = prisma.user.findMany.mock.calls[0][0].where;
    expect(where.role).toBe('REDACTEUR');
    expect(where.OR.some((c: Record<string, unknown>) => 'nom' in c)).toBe(true);
  });
});
