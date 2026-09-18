import { Module } from '@nestjs/common';
import { ContenusService } from './services/contenus.service';
import { ContenusController } from './controllers/contenus.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ContenusController],
  providers: [ContenusService],
  exports: [ContenusService],
})
export class ContenusModule {}
