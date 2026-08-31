import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

/**
 * Cache applicatif.
 * - Si REDIS_HOST est défini (production, ex. Render + Redis), on utilise Redis.
 * - Sinon (développement local sans Redis), on retombe sur le cache mémoire
 *   intégré de cache-manager, afin que l'application démarre sans Redis.
 */
const useRedis = Boolean(process.env.REDIS_HOST);

@Module({
  imports: [
    NestCacheModule.register(
      useRedis
        ? {
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            ttl: 3600, // 1 heure
            max: 100, // 100 entrées max
          }
        : {
            // Cache mémoire par défaut (aucune configuration externe requise)
            ttl: 3600,
            max: 100,
          },
    ),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}

