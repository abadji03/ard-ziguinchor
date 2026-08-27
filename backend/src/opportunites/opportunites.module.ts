import { Module } from '@nestjs/common';
import { OpportunitesService } from './services/opportunites.service';
import { OpportunitesController } from './controllers/opportunites.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OpportunitesController],
  providers: [OpportunitesService],
  exports: [OpportunitesService],
})
export class OpportunitesModule {}
