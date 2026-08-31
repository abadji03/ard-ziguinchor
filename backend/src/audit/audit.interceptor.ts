import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

const ACTION_BY_METHOD: Record<string, string> = {
  POST: 'CREATION',
  PUT: 'MODIFICATION',
  PATCH: 'MODIFICATION',
  DELETE: 'SUPPRESSION',
};

/** Entités dont les consultations (GET) sont journalisées. */
const AUDITED_GET_PREFIXES = ['auth/users'];

/**
 * Intercepteur global de journalisation.
 * - Connexion / échec de connexion : journalisés dans AuthController.
 * - Toute requête de mutation (POST/PATCH/PUT/DELETE) aboutie : CREATION /
 *   MODIFICATION / SUPPRESSION sur l'entité déduite de l'URL.
 * - Consultations : uniquement pour les routes sensibles (gestion des
 *   utilisateurs), afin d'éviter de noyer le journal.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      url: string;
      user?: { userId: string; email: string };
      ip?: string;
      params?: Record<string, string>;
    }>();

    const { method, url, user } = request;
    if (!user) return next.handle(); // requêtes publiques non journalisées

    const path = url.split('?')[0].replace(/^\/api\/?/, '');
    const segments = path.split('/').filter(Boolean);
    const entite = segments[0] || 'inconnu';
    const entiteId = segments[segments.length - 1] && segments[0] !== segments[segments.length - 1]
      ? segments[segments.length - 1]
      : undefined;

    let action: string | undefined;
    if (method === 'GET') {
      if (AUDITED_GET_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) {
        action = 'CONSULTATION';
      }
    } else {
      action = ACTION_BY_METHOD[method];
    }

    if (!action) return next.handle();

    return next.handle().pipe(
      tap({
        next: () => {
          void this.auditService.log({
            userId: user.userId,
            userEmail: user.email,
            action,
            entite,
            entiteId,
            ip: request.ip,
          });
        },
      }),
    );
  }
}
