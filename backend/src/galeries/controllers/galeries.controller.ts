import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { GaleriesService } from '../services/galeries.service';
import { CreateGalerieDto } from '../dto/create-galerie.dto';
import { QueryGalerieDto } from '../dto/query-galerie.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Galeries')
@Controller('galeries')
export class GaleriesController {
  constructor(private readonly galeriesService: GaleriesService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des galeries' })
  findAll(@Query() query: QueryGalerieDto) {
    return this.galeriesService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une galerie par son ID' })
  findOne(@Param('id') id: string) {
    return this.galeriesService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une galerie' })
  create(@Body() createDto: CreateGalerieDto) {
    return this.galeriesService.create(createDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une galerie' })
  update(@Param('id') id: string, @Body() data: Partial<CreateGalerieDto>) {
    return this.galeriesService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une galerie' })
  remove(@Param('id') id: string) {
    return this.galeriesService.remove(id);
  }

  // ─── Gestion des médias ─────────────────────────────────────────────────────

  @Post(':id/medias')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Uploader et ajouter un média (image) à une galerie' })
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  addMedia(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('texteAlt') texteAlt?: string,
    @Body('legende') legende?: string,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');
    return this.galeriesService.addMedia(id, file, { texteAlt, legende });
  }

  @Post(':id/medias/url')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un média depuis une URL (image ou vidéo)' })
  addMediaFromUrl(
    @Param('id') id: string,
    @Body() body: { url: string; nom?: string; type?: string; texteAlt?: string; legende?: string },
  ) {
    if (!body.url) throw new BadRequestException('URL requise');
    return this.galeriesService.addMediaFromUrl(id, body);
  }

  @Delete(':id/medias/:mediaId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retirer un média d\'une galerie' })
  removeMedia(
    @Param('id') id: string,
    @Param('mediaId') mediaId: string,
  ) {
    return this.galeriesService.removeMedia(id, mediaId);
  }
}
