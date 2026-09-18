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
import { ReferencesService } from './references.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Références')
@Controller('references')
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  // ─── Catégories d'actualités ────────────────────────────────────────────────

  @Public()
  @Get('categories-actualites')
  @ApiOperation({ summary: "Liste des catégories d'actualités" })
  findAllCategorieActualites() {
    return this.referencesService.findAllCategorieActualites();
  }

  @Public()
  @Get('categories-actualites/:id')
  @ApiOperation({ summary: "Détail d'une catégorie d'actualités" })
  findOneCategorieActualite(@Param('id') id: string) {
    return this.referencesService.findOneCategorieActualite(id);
  }

  @Post('categories-actualites')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Créer une catégorie d'actualités" })
  createCategorieActualite(@Body() data: Record<string, unknown>) {
    return this.referencesService.createCategorieActualite(data);
  }

  @Patch('categories-actualites/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modifier une catégorie d'actualités" })
  updateCategorieActualite(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateCategorieActualite(id, data);
  }

  @Delete('categories-actualites/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Supprimer une catégorie d'actualités" })
  removeCategorieActualite(@Param('id') id: string) {
    return this.referencesService.removeCategorieActualite(id);
  }

  // ─── Catégories de documents ────────────────────────────────────────────────

  @Public()
  @Get('categories-documents')
  @ApiOperation({ summary: 'Liste des catégories de documents' })
  findAllCategorieDocuments() {
    return this.referencesService.findAllCategorieDocuments();
  }

  @Public()
  @Get('categories-documents/:id')
  @ApiOperation({ summary: "Détail d'une catégorie de documents" })
  findOneCategorieDocument(@Param('id') id: string) {
    return this.referencesService.findOneCategorieDocument(id);
  }

  @Post('categories-documents')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une catégorie de documents' })
  createCategorieDocument(@Body() data: Record<string, unknown>) {
    return this.referencesService.createCategorieDocument(data);
  }

  @Patch('categories-documents/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une catégorie de documents' })
  updateCategorieDocument(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateCategorieDocument(id, data);
  }

  @Delete('categories-documents/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une catégorie de documents' })
  removeCategorieDocument(@Param('id') id: string) {
    return this.referencesService.removeCategorieDocument(id);
  }

  // ─── Types de partenaires ───────────────────────────────────────────────────

  @Public()
  @Get('types-partenaires')
  @ApiOperation({ summary: 'Liste des types de partenaires' })
  findAllTypePartenaires() {
    return this.referencesService.findAllTypePartenaires();
  }

  @Public()
  @Get('types-partenaires/:id')
  @ApiOperation({ summary: "Détail d'un type de partenaire" })
  findOneTypePartenaire(@Param('id') id: string) {
    return this.referencesService.findOneTypePartenaire(id);
  }

  @Post('types-partenaires')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un type de partenaire' })
  createTypePartenaire(@Body() data: Record<string, unknown>) {
    return this.referencesService.createTypePartenaire(data);
  }

  @Patch('types-partenaires/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un type de partenaire' })
  updateTypePartenaire(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateTypePartenaire(id, data);
  }

  @Delete('types-partenaires/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un type de partenaire' })
  removeTypePartenaire(@Param('id') id: string) {
    return this.referencesService.removeTypePartenaire(id);
  }

  // ─── Types d'opportunités ───────────────────────────────────────────────────

  @Public()
  @Get('types-opportunites')
  @ApiOperation({ summary: "Liste des types d'opportunités" })
  findAllTypeOpportunites() {
    return this.referencesService.findAllTypeOpportunites();
  }

  @Public()
  @Get('types-opportunites/:id')
  @ApiOperation({ summary: "Détail d'un type d'opportunité" })
  findOneTypeOpportunite(@Param('id') id: string) {
    return this.referencesService.findOneTypeOpportunite(id);
  }

  @Post('types-opportunites')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Créer un type d'opportunité" })
  createTypeOpportunite(@Body() data: Record<string, unknown>) {
    return this.referencesService.createTypeOpportunite(data);
  }

  @Patch('types-opportunites/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Modifier un type d'opportunité" })
  updateTypeOpportunite(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateTypeOpportunite(id, data);
  }

  @Delete('types-opportunites/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Supprimer un type d'opportunité" })
  removeTypeOpportunite(@Param('id') id: string) {
    return this.referencesService.removeTypeOpportunite(id);
  }

  // ─── Catégories FAQ ─────────────────────────────────────────────────────────

  @Public()
  @Get('categories-faq')
  @ApiOperation({ summary: 'Liste des catégories FAQ' })
  findAllCategorieFaqs() {
    return this.referencesService.findAllCategorieFaqs();
  }

  @Public()
  @Get('categories-faq/:id')
  @ApiOperation({ summary: "Détail d'une catégorie FAQ" })
  findOneCategorieFaq(@Param('id') id: string) {
    return this.referencesService.findOneCategorieFaq(id);
  }

  @Post('categories-faq')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une catégorie FAQ' })
  createCategorieFaq(@Body() data: Record<string, unknown>) {
    return this.referencesService.createCategorieFaq(data);
  }

  @Patch('categories-faq/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une catégorie FAQ' })
  updateCategorieFaq(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateCategorieFaq(id, data);
  }

  @Delete('categories-faq/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une catégorie FAQ' })
  removeCategorieFaq(@Param('id') id: string) {
    return this.referencesService.removeCategorieFaq(id);
  }

  // ─── Secteurs ───────────────────────────────────────────────────────────────

  @Public()
  @Get('secteurs')
  @ApiOperation({ summary: 'Liste des secteurs' })
  findAllSecteurs() {
    return this.referencesService.findAllSecteurs();
  }

  @Public()
  @Get('secteurs/:id')
  @ApiOperation({ summary: "Détail d'un secteur" })
  findOneSecteur(@Param('id') id: string) {
    return this.referencesService.findOneSecteur(id);
  }

  @Post('secteurs')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un secteur' })
  createSecteur(@Body() data: Record<string, unknown>) {
    return this.referencesService.createSecteur(data);
  }

  @Patch('secteurs/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un secteur' })
  updateSecteur(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateSecteur(id, data);
  }

  @Delete('secteurs/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un secteur' })
  removeSecteur(@Param('id') id: string) {
    return this.referencesService.removeSecteur(id);
  }

  // ─── Départements ───────────────────────────────────────────────────────────

  @Public()
  @Get('departements')
  @ApiOperation({ summary: 'Liste des départements' })
  findAllDepartements() {
    return this.referencesService.findAllDepartements();
  }

  @Public()
  @Get('departements/:id')
  @ApiOperation({ summary: "Détail d'un département" })
  findOneDepartement(@Param('id') id: string) {
    return this.referencesService.findOneDepartement(id);
  }

  @Post('departements')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un département' })
  createDepartement(@Body() data: Record<string, unknown>) {
    return this.referencesService.createDepartement(data);
  }

  @Patch('departements/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un département' })
  updateDepartement(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateDepartement(id, data);
  }

  @Delete('departements/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un département' })
  removeDepartement(@Param('id') id: string) {
    return this.referencesService.removeDepartement(id);
  }

  // ─── Arrondissements ────────────────────────────────────────────────────────

  @Public()
  @Get('arrondissements')
  @ApiOperation({ summary: 'Liste des arrondissements' })
  findAllArrondissements() {
    return this.referencesService.findAllArrondissements();
  }

  @Public()
  @Get('departements/:departementId/arrondissements')
  @ApiOperation({ summary: "Liste des arrondissements d'un département" })
  findArrondissementsByDepartement(
    @Param('departementId') departementId: string,
  ) {
    return this.referencesService.findAllArrondissements(departementId);
  }

  @Public()
  @Get('arrondissements/:id')
  @ApiOperation({ summary: "Détail d'un arrondissement" })
  findOneArrondissement(@Param('id') id: string) {
    return this.referencesService.findOneArrondissement(id);
  }

  @Post('arrondissements')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un arrondissement' })
  createArrondissement(@Body() data: Record<string, unknown>) {
    return this.referencesService.createArrondissement(data);
  }

  @Patch('arrondissements/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un arrondissement' })
  updateArrondissement(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateArrondissement(id, data);
  }

  @Delete('arrondissements/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un arrondissement' })
  removeArrondissement(@Param('id') id: string) {
    return this.referencesService.removeArrondissement(id);
  }

  // ─── Communes ───────────────────────────────────────────────────────────────

  @Public()
  @Get('communes')
  @ApiOperation({ summary: 'Liste des communes' })
  findAllCommunes() {
    return this.referencesService.findAllCommunes();
  }

  @Public()
  @Get('departements/:departementId/communes')
  @ApiOperation({ summary: "Liste des communes d'un département" })
  findCommunesByDepartement(@Param('departementId') departementId: string) {
    return this.referencesService.findAllCommunes(departementId);
  }

  @Public()
  @Get('arrondissements/:arrondissementId/communes')
  @ApiOperation({ summary: "Liste des communes d'un arrondissement" })
  findCommunesByArrondissement(@Param('arrondissementId') arrondissementId: string) {
    return this.referencesService.findAllCommunes(undefined, arrondissementId);
  }

  @Public()
  @Get('communes/:id')
  @ApiOperation({ summary: "Détail d'une commune" })
  findOneCommune(@Param('id') id: string) {
    return this.referencesService.findOneCommune(id);
  }

  @Post('communes')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une commune' })
  createCommune(@Body() data: Record<string, unknown>) {
    return this.referencesService.createCommune(data);
  }

  @Patch('communes/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une commune' })
  updateCommune(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateCommune(id, data);
  }

  @Delete('communes/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une commune' })
  removeCommune(@Param('id') id: string) {
    return this.referencesService.removeCommune(id);
  }

  // ─── Services (organisation interne) ────────────────────────────────────────

  @Public()
  @Get('services')
  @ApiOperation({ summary: 'Liste des services' })
  findAllServices() {
    return this.referencesService.findAllServices();
  }

  @Public()
  @Get('services/:id')
  @ApiOperation({ summary: "Détail d'un service" })
  findOneService(@Param('id') id: string) {
    return this.referencesService.findOneService(id);
  }

  @Post('services')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un service' })
  createService(@Body() data: Record<string, unknown>) {
    return this.referencesService.createService(data);
  }

  @Patch('services/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un service' })
  updateService(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateService(id, data);
  }

  @Delete('services/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un service' })
  removeService(@Param('id') id: string) {
    return this.referencesService.removeService(id);
  }

  // ─── Chiffres clés ──────────────────────────────────────────────────────────

  @Public()
  @Get('chiffres-cles')
  @ApiOperation({ summary: 'Liste des chiffres clés (version publique, avec calculs auto)' })
  findAllChiffresCles() {
    return this.referencesService.findAllChiffresCles();
  }

  @Get('chiffres-cles-raw')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste brute des chiffres clés depuis la base (admin)' })
  findAllChiffresClesRaw() {
    return this.referencesService.findAllChiffresClesRaw();
  }

  @Public()
  @Get('chiffres-cles/:id')
  @ApiOperation({ summary: "Détail d'un chiffre clé" })
  findOneChiffreCle(@Param('id') id: string) {
    return this.referencesService.findOneChiffreCle(id);
  }

  @Post('chiffres-cles')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un chiffre clé' })
  createChiffreCle(@Body() data: Record<string, unknown>) {
    return this.referencesService.createChiffreCle(data);
  }

  @Patch('chiffres-cles/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un chiffre clé' })
  updateChiffreCle(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateChiffreCle(id, data);
  }

  @Delete('chiffres-cles/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un chiffre clé' })
  removeChiffreCle(@Param('id') id: string) {
    return this.referencesService.removeChiffreCle(id);
  }

  // ─── Témoignages ────────────────────────────────────────────────────────────

  @Public()
  @Get('temoignages')
  @ApiOperation({ summary: 'Liste des témoignages' })
  findAllTemoignages() {
    return this.referencesService.findAllTemoignages();
  }

  @Public()
  @Get('temoignages/:id')
  @ApiOperation({ summary: "Détail d'un témoignage" })
  findOneTemoignage(@Param('id') id: string) {
    return this.referencesService.findOneTemoignage(id);
  }

  @Post('temoignages')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un témoignage' })
  createTemoignage(@Body() data: Record<string, unknown>) {
    return this.referencesService.createTemoignage(data);
  }

  @Patch('temoignages/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un témoignage' })
  updateTemoignage(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateTemoignage(id, data);
  }

  @Delete('temoignages/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un témoignage' })
  removeTemoignage(@Param('id') id: string) {
    return this.referencesService.removeTemoignage(id);
  }

  // ─── Bannières ──────────────────────────────────────────────────────────────

  @Public()
  @Get('bannieres')
  @ApiOperation({ summary: 'Liste des bannières actives' })
  findAllBannieres() {
    return this.referencesService.findAllBannieres();
  }

  @Public()
  @Get('bannieres/:id')
  @ApiOperation({ summary: "Détail d'une bannière" })
  findOneBanniere(@Param('id') id: string) {
    return this.referencesService.findOneBanniere(id);
  }

  @Post('bannieres')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une bannière' })
  createBanniere(@Body() data: Record<string, unknown>) {
    return this.referencesService.createBanniere(data);
  }

  @Patch('bannieres/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une bannière' })
  updateBanniere(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateBanniere(id, data);
  }

  @Delete('bannieres/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une bannière' })
  removeBanniere(@Param('id') id: string) {
    return this.referencesService.removeBanniere(id);
  }

  // ─── Menus ──────────────────────────────────────────────────────────────────

  @Public()
  @Get('menus')
  @ApiOperation({ summary: 'Liste des menus actifs' })
  findAllMenus() {
    return this.referencesService.findAllMenus();
  }

  @Public()
  @Get('menus/:id')
  @ApiOperation({ summary: "Détail d'un menu" })
  findOneMenu(@Param('id') id: string) {
    return this.referencesService.findOneMenu(id);
  }

  @Post('menus')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un menu' })
  createMenu(@Body() data: Record<string, unknown>) {
    return this.referencesService.createMenu(data);
  }

  @Patch('menus/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un menu' })
  updateMenu(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return this.referencesService.updateMenu(id, data);
  }

  @Delete('menus/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un menu' })
  removeMenu(@Param('id') id: string) {
    return this.referencesService.removeMenu(id);
  }

  // ─── Réseaux sociaux ────────────────────────────────────────────────────────

  @Public()
  @Get('reseaux-sociaux')
  @ApiOperation({ summary: 'Liste des réseaux sociaux' })
  findAllReseauxSociaux() {
    return this.referencesService.findAllReseauxSociaux();
  }

  @Public()
  @Get('reseaux-sociaux/:id')
  @ApiOperation({ summary: "Détail d'un réseau social" })
  findOneReseauSocial(@Param('id') id: string) {
    return this.referencesService.findOneReseauSocial(id);
  }

  @Post('reseaux-sociaux')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un réseau social' })
  createReseauSocial(@Body() data: Record<string, unknown>) {
    return this.referencesService.createReseauSocial(data);
  }

  @Patch('reseaux-sociaux/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un réseau social' })
  updateReseauSocial(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateReseauSocial(id, data);
  }

  @Delete('reseaux-sociaux/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un réseau social' })
  removeReseauSocial(@Param('id') id: string) {
    return this.referencesService.removeReseauSocial(id);
  }

  // ── Contenus éditoriaux ────────────────────────────────────────────────────

  @Public()
  @Get('contenus-editoriaux')
  @ApiOperation({
    summary:
      'Liste des contenus éditoriaux (filtrable par type, section ; includeInactifs=true pour l’admin)',
  })
  findAllContenusEditoriaux(
    @Query('type') type?: string,
    @Query('section') section?: string,
    @Query('includeInactifs') includeInactifs?: string,
  ) {
    return this.referencesService.findAllContenusEditoriaux({
      type,
      section,
      includeInactifs: includeInactifs === 'true',
    });
  }

  @Public()
  @Get('contenus-editoriaux/:id')
  @ApiOperation({ summary: "Détail d'un contenu éditorial" })
  findOneContenuEditorial(@Param('id') id: string) {
    return this.referencesService.findOneContenuEditorial(id);
  }

  @Post('contenus-editoriaux')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un contenu éditorial' })
  createContenuEditorial(@Body() data: Record<string, unknown>) {
    return this.referencesService.createContenuEditorial(data);
  }

  @Patch('contenus-editoriaux/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un contenu éditorial' })
  updateContenuEditorial(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateContenuEditorial(id, data);
  }

  @Delete('contenus-editoriaux/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un contenu éditorial' })
  removeContenuEditorial(@Param('id') id: string) {
    return this.referencesService.removeContenuEditorial(id);
  }

  // ── Paramètres du site ─────────────────────────────────────────────────────

  @Public()
  @Get('parametres-site')
  @ApiOperation({ summary: 'Récupérer les paramètres du site' })
  findParametresSite() {
    return this.referencesService.findParametresSite();
  }

    @Patch('parametres-site')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour les paramètres du site' })
  updateParametresSite(@Body() data: Record<string, unknown>) {
    return this.referencesService.updateParametresSite(data);
  }

  // ── Contenus statiques ───────────────────────────────────────────────────────
  // Textes institutionnels adressables par clé (pages légales, discours…).
  @Public()
  @Get('contenus-statiques/cle/:cle')
  @ApiOperation({ summary: 'Contenu statique par clé (public, fallback sur le code si absent)' })
  findContenuStatiqueByCle(@Param('cle') cle: string) {
    return this.referencesService.findContenuStatiqueByCle(cle);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @Get('contenus-statiques')
  @ApiOperation({ summary: 'Liste des contenus statiques (admin, inclut les inactifs)' })
  findAllContenusStatiques(@Query('includeInactifs') includeInactifs?: string) {
    return this.referencesService.findAllContenusStatiques(
      includeInactifs === 'true',
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @Post('contenus-statiques')
  @ApiOperation({ summary: 'Créer un contenu statique' })
  createContenuStatique(@Body() data: Record<string, unknown>) {
    return this.referencesService.createContenuStatique(data as any);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @Patch('contenus-statiques/:id')
  @ApiOperation({ summary: 'Modifier un contenu statique' })
  updateContenuStatique(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateContenuStatique(id, data as any);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @Delete('contenus-statiques/:id')
  @ApiOperation({ summary: 'Supprimer un contenu statique' })
  removeContenuStatique(@Param('id') id: string) {
    return this.referencesService.removeContenuStatique(id);
  }

  // ── Navigation ───────────────────────────────────────────────────────────────
  @Public()
  @Get('navigation')
  @ApiOperation({ summary: "Navigation du site (header/footer/legal) — publique" })
  findNavigation(@Query('section') section?: string) {
    return this.referencesService.findAllNavigation(section);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @Post('navigation')
  @ApiOperation({ summary: 'Créer un élément de navigation' })
  createNavigationItem(@Body() data: Record<string, unknown>) {
    return this.referencesService.createNavigationItem(data as any);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.EDITEUR)
  @ApiBearerAuth()
  @Patch('navigation/:id')
  @ApiOperation({ summary: 'Modifier un élément de navigation' })
  updateNavigationItem(
    @Param('id') id: string,
    @Body() data: Record<string, unknown>,
  ) {
    return this.referencesService.updateNavigationItem(id, data as any);
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiBearerAuth()
  @Delete('navigation/:id')
  @ApiOperation({ summary: 'Supprimer un élément de navigation' })
  removeNavigationItem(@Param('id') id: string) {
    return this.referencesService.removeNavigationItem(id);
  }
}
