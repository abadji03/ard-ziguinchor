import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../../audit/audit.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

interface AuthRequest {
  user: { userId: string; email: string; role: Role };
}

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private auditService: AuditService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  async login(@Body() loginDto: LoginDto, @Request() req: { ip?: string }) {
    let user: Awaited<ReturnType<AuthService['validateUser']>> | null;
    try {
      user = await this.authService.validateUser(loginDto.email, loginDto.password);
    } catch (err) {
      // Compte désactivé — journalisé comme échec de connexion
      void this.auditService.log({
        userEmail: loginDto.email,
        action: 'ECHEC_CONNEXION',
        entite: 'auth',
        details: err instanceof Error ? err.message : 'Erreur inconnue',
        ip: req.ip,
      });
      throw err;
    }
    if (!user) {
      void this.auditService.log({
        userEmail: loginDto.email,
        action: 'ECHEC_CONNEXION',
        entite: 'auth',
        details: 'Email ou mot de passe incorrect',
        ip: req.ip,
      });
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Connexion réussie → dernierLogin + journal
    void this.auditService.log({
      userId: user.id,
      userEmail: user.email,
      action: 'CONNEXION',
      entite: 'auth',
      ip: req.ip,
    });
    void this.authService.touchLastLogin(user.id);

    return this.authService.login(user);
  }

  // Création de comptes réservée aux SUPER_ADMIN et ADMIN
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un compte (ADMIN uniquement)' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil de l\'utilisateur connecté' })
  async getProfile(@Request() req: AuthRequest) {
    return this.authService.findById(req.user.userId);
  }
}
