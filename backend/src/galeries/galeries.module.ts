import { Module } from '@nestjs/common';
import { GaleriesService } from './services/galeries.service';
import { GaleriesAutoSyncService } from './services/galeries-auto-sync.service';
import { GaleriesController } from './controllers/galeries.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [GaleriesController],
  providers: [GaleriesService, GaleriesAutoSyncService],
  exports: [GaleriesService, GaleriesAutoSyncService],
})
export class GaleriesModule {}
