import { Module } from '@nestjs/common';
import { RechercheService } from './recherche.service';
import { RechercheController } from './recherche.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RechercheController],
  providers: [RechercheService],
  exports: [RechercheService],
})
export class RechercheModule {}
