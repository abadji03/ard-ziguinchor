import { Module } from '@nestjs/common';
import { EvenementsService } from './services/evenements.service';
import { EvenementsController } from './controllers/evenements.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EvenementsController],
  providers: [EvenementsService],
  exports: [EvenementsService],
})
export class EvenementsModule {}
