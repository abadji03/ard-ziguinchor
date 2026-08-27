import { Module } from '@nestjs/common';
import { ProgrammesService } from './services/programmes.service';
import { ProgrammesController } from './controllers/programmes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GaleriesModule } from '../galeries/galeries.module';

@Module({
  imports: [PrismaModule, GaleriesModule],
  controllers: [ProgrammesController],
  providers: [ProgrammesService],
  exports: [ProgrammesService],
})
export class ProgrammesModule {}
