import { Module } from '@nestjs/common';
import { FaqService } from './services/faq.service';
import { FaqController } from './controllers/faq.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FaqController],
  providers: [FaqService],
  exports: [FaqService],
})
export class FaqModule {}
