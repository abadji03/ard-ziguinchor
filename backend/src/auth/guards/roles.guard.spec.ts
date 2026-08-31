import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: jest.Mock };

  const createContext = (user?: { role: Role }): ExecutionContext => {
    const request: Record<string, unknown> = user ? { user } : {};
    return {
      getHandler: () => () => undefined,
      getClass: () => class {},
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('autorise l\'accès si aucune route n\'est protégée par des rôles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('autorise l\'accès si la liste de rôles est vide', () => {
    reflector.getAllAndOverride.mockReturnValue([]);
    expect(guard.canActivate(createContext())).toBe(true);
  });

  it('refuse l\'accès si l\'utilisateur n\'est pas authentifié', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(createContext())).toBe(false);
  });

  it('autorise l\'accès si le rôle de l\'utilisateur est requis', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN, Role.REDACTEUR]);
    expect(guard.canActivate(createContext({ role: Role.ADMIN }))).toBe(true);
  });

  it('refuse l\'accès si le rôle ne correspond pas', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);
    expect(guard.canActivate(createContext({ role: Role.REDACTEUR }))).toBe(false);
  });

  it('lit les métadonnées avec la clé ROLES_KEY', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    guard.canActivate(createContext());
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
