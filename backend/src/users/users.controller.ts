import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query, Request, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, ResetPasswordDto } from './dto/users.dto';
import { Roles } from '../auth/decorators/roles.decorator';

/**
 * Gestion des utilisateurs — réservée aux ADMIN / SUPER_ADMIN.
 * Les utilisateurs standards (EDITEUR, REDACTEUR, CONTRIBUTEUR) ne peuvent
 * ni créer, ni modifier, ni supprimer des comptes (y compris le leur).
 * La réinitialisation de mot de passe se fait exclusivement par l'admin.
 */
@ApiTags('Utilisateurs')
@ApiBearerAuth()
@Roles(Role.SUPER_ADMIN, Role.ADMIN)
@Controller('auth/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les utilisateurs (ADMIN)' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: Role,
  ) {
    return this.usersService.findAll({ page, limit, search, role });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un utilisateur (ADMIN)' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un utilisateur (ADMIN)' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un utilisateur (ADMIN)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Réinitialiser le mot de passe (ADMIN uniquement)' })
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur (ADMIN)' })
  remove(@Param('id') id: string, @Request() req: { user: { userId: string } }) {
    return this.usersService.remove(id, req.user.userId);
  }
}
