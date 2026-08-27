import { Module } from '@nestjs/common';
import { PartenairesService } from './services/partenaires.service';
import { PartenairesController } from './controllers/partenaires.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PartenairesController],
  providers: [PartenairesService],
  exports: [PartenairesService],
})
export class PartenairesModule {}
