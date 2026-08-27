import { Module } from '@nestjs/common';
import { IndicateursService } from './services/indicateurs.service';
import { IndicateursController } from './controllers/indicateurs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IndicateursController],
  providers: [IndicateursService],
  exports: [IndicateursService],
})
export class IndicateursModule {}
