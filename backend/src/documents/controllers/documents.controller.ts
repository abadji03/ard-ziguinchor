import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import axios from 'axios';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentsService } from '../services/documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { QueryDocumentDto } from '../dto/query-document.dto';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

// Correspondance extension → Content-Type pour forcer un type correct
// lors du téléchargement (évite les fichiers renvoyés en application/octet-stream).
const MIME_BY_EXTENSION: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  txt: 'text/plain',
  rtf: 'application/rtf',
  csv: 'text/csv',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
};

@ApiTags('Documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  // ─── Lecture publique ───────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'Liste paginée des documents avec filtres' })
  findAll(@Query() query: QueryDocumentDto) {
    return this.documentsService.findAll(query);
  }

  @Public()
  @Get('territoriale')
  @ApiOperation({
    summary: 'Documents de planification territoriale organisés',
  })
  findTerritoriale() {
    return this.documentsService.findTerritoriale();
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Récupérer un document par son slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.documentsService.findBySlug(slug);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un document par son ID' })
  findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  // ─── Écriture protégée ──────────────────────────────────────────────────────

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un document' })
  create(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentsService.create(createDocumentDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR, Role.REDACTEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un document' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateDocumentDto>,
  ) {
    return this.documentsService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un document' })
  remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }

  @Public()
  @Post(':id/telecharger')
  @ApiOperation({ summary: 'Incrémenter le compteur de téléchargements' })
  async telecharger(@Param('id') id: string) {
    return this.documentsService.incrementTelechargements(id);
  }

  @Public()
  @Get(':id/download')
  @ApiOperation({ summary: 'Télécharger un document' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const doc = await this.documentsService.findOneForDownload(id);
    let response;
    try {
      response = await axios.get(doc.fichier, { responseType: 'stream' });
    } catch (error) {
      const status = (axios.isAxiosError(error) && error.response?.status) || 502;
      const cldError = axios.isAxiosError(error)
        ? String(error.response?.headers?.['x-cld-error'] || '')
        : '';
      throw new BadRequestException(
        `Fichier distant inaccessible (code ${status})${cldError ? ` : ${cldError}` : ''}`,
      );
    }
    if (!response.status || response.status < 200 || response.status >= 300) {
      throw new BadRequestException(`Fichier distant inaccessible (code ${response.status})`);
    }
    const filename = doc.titre.replace(/[^a-zA-Z0-9-_]+/g, '_') + '.' + doc.format;
    // Priorité au Content-Type dérivé de doc.format (fiable),
    // sinon on retombe sur celui de Cloudinary.
    const cldContentType = String(response.headers['content-type'] || 'application/octet-stream');
    const contentType = MIME_BY_EXTENSION[(doc.format || '').toLowerCase()] || cldContentType;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    response.data.pipe(res);
    return res;
  }
}
