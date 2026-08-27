import { Module } from '@nestjs/common';
import { ProjetsService } from './services/projets.service';
import { ProjetsController } from './controllers/projets.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GaleriesModule } from '../galeries/galeries.module';

@Module({
  imports: [PrismaModule, GaleriesModule],
  controllers: [ProjetsController],
  providers: [ProjetsService],
  exports: [ProjetsService],
})
export class ProjetsModule {}
