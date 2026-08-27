import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FaqService } from '../services/faq.service';
import { CreateFaqDto } from '../dto/create-faq.dto';
import { QueryFaqDto } from '../dto/query-faq.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des FAQ avec filtres' })
  findAll(@Query() query: QueryFaqDto) {
    return this.faqService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une FAQ par son ID' })
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une FAQ' })
  create(@Body() createDto: CreateFaqDto) {
    return this.faqService.create(createDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une FAQ' })
  update(@Param('id') id: string, @Body() data: Partial<CreateFaqDto>) {
    return this.faqService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une FAQ' })
  remove(@Param('id') id: string) {
    return this.faqService.remove(id);
  }
}
