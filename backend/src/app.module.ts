import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ActualitesModule } from './actualites/actualites.module';
import { ProjetsModule } from './projets/projets.module';
import { ProgrammesModule } from './programmes/programmes.module';
import { DocumentsModule } from './documents/documents.module';
import { PartenairesModule } from './partenaires/partenaires.module';
import { EvenementsModule } from './evenements/evenements.module';
import { OpportunitesModule } from './opportunites/opportunites.module';
import { FaqModule } from './faq/faq.module';
import { GaleriesModule } from './galeries/galeries.module';
import { IndicateursModule } from './indicateurs/indicateurs.module';
import { MembresModule } from './membres/membres.module';
import { MediaModule } from './media/media.module';
import { UploadModule } from './upload/upload.module';
import { RechercheModule } from './recherche/recherche.module';
import { CacheModule } from './cache/cache.module';
import { SecurityModule } from './security/security.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { ReferencesModule } from './references/references.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ActualitesModule,
    ProjetsModule,
    ProgrammesModule,
    DocumentsModule,
    PartenairesModule,
    EvenementsModule,
    OpportunitesModule,
    FaqModule,
    GaleriesModule,
    IndicateursModule,
    MembresModule,
    MediaModule,
    UploadModule,
    RechercheModule,
    CacheModule,
    SecurityModule,
    CloudinaryModule,
    EmailModule,
    ReferencesModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
