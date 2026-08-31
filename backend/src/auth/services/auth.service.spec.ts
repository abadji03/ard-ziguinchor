import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

const mockUser = {
  id: 'user-1',
  email: 'admin@ard.sn',
  nom: 'Diop',
  prenom: 'Awa',
  telephone: '770000000',
  role: Role.ADMIN,
  actif: true,
  password: 'hashed-password',
  createdAt: new Date('2024-01-01'),
};

// bcrypt utilise un binding natif non espionnable : on hache réellement
// un mot de passe de test et on vérifie via compare.
const PLAIN_PASSWORD = 'password123';

beforeAll(async () => {
  mockUser.password = await bcrypt.hash(PLAIN_PASSWORD, 4);
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwtService = { sign: jest.fn().mockReturnValue('signed-token') };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
  });

  describe('validateUser', () => {
    it('retourne l\'utilisateur sans son mot de passe si les identifiants sont valides', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('admin@ard.sn', PLAIN_PASSWORD);

      expect(result).toEqual(expect.objectContaining({ id: 'user-1', email: 'admin@ard.sn' }));
      expect(result).not.toHaveProperty('password');
    });

    it('retourne null si l\'email est inconnu', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      const result = await service.validateUser('inconnu@ard.sn', 'password');
      expect(result).toBeNull();
    });

    it('retourne null si le mot de passe est invalide', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('admin@ard.sn', 'mauvais');
      expect(result).toBeNull();
    });

    it('lève UnauthorizedException si le compte est désactivé', async () => {
      prisma.user.findUnique.mockResolvedValue({ ...mockUser, actif: false });

      await expect(service.validateUser('admin@ard.sn', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('signe un JWT avec email, sub et role, et retourne un profil sans mot de passe', () => {
      const result = service.login({
        id: 'user-1',
        email: 'admin@ard.sn',
        nom: 'Diop',
        prenom: 'Awa',
        telephone: null,
        role: Role.ADMIN,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'admin@ard.sn',
        sub: 'user-1',
        role: Role.ADMIN,
      });
      expect(result.access_token).toBe('signed-token');
      expect(result.user).toEqual({
        id: 'user-1',
        email: 'admin@ard.sn',
        nom: 'Diop',
        prenom: 'Awa',
        role: Role.ADMIN,
      });
    });
  });

  describe('register', () => {
    const dto = {
      email: 'new@ard.sn',
      password: 'password123',
      nom: 'Ndiaye',
      prenom: 'Moussa',
      telephone: '781234567',
    };

    it('crée un compte avec le rôle REDACTEUR par défaut et un mot de passe hashé', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({ id: 'user-2', ...dto, role: Role.REDACTEUR });

      const result = await service.register(dto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@ard.sn',
            role: Role.REDACTEUR,
          }),
        }),
      );
      const data = prisma.user.create.mock.calls[0][0].data;
      // Le mot de passe stocké n'est pas celui en clair
      expect(data.password).not.toBe('password123');
      expect(result).toEqual(expect.objectContaining({ id: 'user-2' }));
    });

    it('lève ConflictException si l\'email existe déjà', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('retourne l\'utilisateur existant', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      const result = await service.findById('user-1');
      expect(result).toEqual(mockUser);
    });

    it('lève NotFoundException si l\'utilisateur n\'existe pas', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findById('nope')).rejects.toThrow(NotFoundException);
    });
  });
});
