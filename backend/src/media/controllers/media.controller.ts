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
import { MediaService } from '../services/media.service';
import { CreateMediaDto } from '../dto/create-media.dto';
import { QueryMediaDto } from '../dto/query-media.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Médias')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des médias' })
  findAll(@Query() query: QueryMediaDto) {
    return this.mediaService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un média par son ID' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un média' })
  create(@Body() dto: CreateMediaDto) {
    return this.mediaService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un média' })
  update(@Param('id') id: string, @Body() data: Partial<CreateMediaDto>) {
    return this.mediaService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un média' })
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
