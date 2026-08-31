import {
  Controller, Get, Query, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuditService } from './audit.service';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Consultation du journal des actions — réservée aux ADMIN / SUPER_ADMIN.
 */
@ApiTags('Journal d\'audit')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Consulter le journal des actions (ADMIN)' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('action') action?: string,
    @Query('userEmail') userEmail?: string,
  ) {
    return this.auditService.findAll({ page, limit, search, action, userEmail });
  }
}
