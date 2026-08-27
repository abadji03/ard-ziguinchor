import { Module } from '@nestjs/common';
import { MembresService } from './services/membres.service';
import { MembresController } from './controllers/membres.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MembresController],
  providers: [MembresService],
  exports: [MembresService],
})
export class MembresModule {}
