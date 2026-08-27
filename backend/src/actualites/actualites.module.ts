import { Module } from '@nestjs/common';
import { ActualitesService } from './services/actualites.service';
import { ActualitesController } from './controllers/actualites.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GaleriesModule } from '../galeries/galeries.module';

@Module({
  imports: [PrismaModule, GaleriesModule],
  controllers: [ActualitesController],
  providers: [ActualitesService],
  exports: [ActualitesService],
})
export class ActualitesModule {}
