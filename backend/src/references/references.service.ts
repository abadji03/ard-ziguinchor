import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferencesService {
  constructor(private prisma: PrismaService) {}

  // ─── Catégories d'actualités ────────────────────────────────────────────────

  async findAllCategorieActualites() {
    return this.prisma.categorieActualite.findMany({
      orderBy: { nom: 'asc' },
      include: { _count: { select: { actualites: true } } },
    });
  }

  async findOneCategorieActualite(id: string) {
    const item = await this.prisma.categorieActualite.findUnique({
      where: { id },
      include: { _count: { select: { actualites: true } } },
    });
    if (!item)
      throw new NotFoundException(`Catégorie actualité #${id} introuvable`);
    return item;
  }

  async createCategorieActualite(data: Record<string, unknown>) {
    return this.prisma.categorieActualite.create({
      data: data as Parameters<
        typeof this.prisma.categorieActualite.create
      >[0]['data'],
    });
  }

  async updateCategorieActualite(id: string, data: Record<string, unknown>) {
    await this.findOneCategorieActualite(id);
    return this.prisma.categorieActualite.update({
      where: { id },
      data: data,
    });
  }

  async removeCategorieActualite(id: string) {
    await this.findOneCategorieActualite(id);
    return this.prisma.categorieActualite.delete({ where: { id } });
  }

  // ─── Catégories de documents ────────────────────────────────────────────────

  async findAllCategorieDocuments() {
    return this.prisma.categorieDocument.findMany({
      orderBy: { nom: 'asc' },
      include: { _count: { select: { documents: true } } },
    });
  }

  async findOneCategorieDocument(id: string) {
    const item = await this.prisma.categorieDocument.findUnique({
      where: { id },
      include: { _count: { select: { documents: true } } },
    });
    if (!item)
      throw new NotFoundException(`Catégorie document #${id} introuvable`);
    return item;
  }

  async createCategorieDocument(data: Record<string, unknown>) {
    return this.prisma.categorieDocument.create({
      data: data as Parameters<
        typeof this.prisma.categorieDocument.create
      >[0]['data'],
    });
  }

  async updateCategorieDocument(id: string, data: Record<string, unknown>) {
    await this.findOneCategorieDocument(id);
    return this.prisma.categorieDocument.update({ where: { id }, data });
  }

  async removeCategorieDocument(id: string) {
    await this.findOneCategorieDocument(id);
    return this.prisma.categorieDocument.delete({ where: { id } });
  }

  // ─── Types de partenaires ───────────────────────────────────────────────────

  async findAllTypePartenaires() {
    return this.prisma.typePartenaire.findMany({
      orderBy: { ordre: 'asc' },
      include: { _count: { select: { partenaires: true } } },
    });
  }

  async findOneTypePartenaire(id: string) {
    const item = await this.prisma.typePartenaire.findUnique({
      where: { id },
      include: { _count: { select: { partenaires: true } } },
    });
    if (!item)
      throw new NotFoundException(`Type partenaire #${id} introuvable`);
    return item;
  }

  async createTypePartenaire(data: Record<string, unknown>) {
    return this.prisma.typePartenaire.create({
      data: data as Parameters<
        typeof this.prisma.typePartenaire.create
      >[0]['data'],
    });
  }

  async updateTypePartenaire(id: string, data: Record<string, unknown>) {
    await this.findOneTypePartenaire(id);
    return this.prisma.typePartenaire.update({ where: { id }, data });
  }

  async removeTypePartenaire(id: string) {
    await this.findOneTypePartenaire(id);
    return this.prisma.typePartenaire.delete({ where: { id } });
  }

  // ─── Types d'opportunités ───────────────────────────────────────────────────

  async findAllTypeOpportunites() {
    return this.prisma.typeOpportunite.findMany({
      orderBy: { ordre: 'asc' },
      include: { _count: { select: { opportunites: true } } },
    });
  }

  async findOneTypeOpportunite(id: string) {
    const item = await this.prisma.typeOpportunite.findUnique({
      where: { id },
      include: { _count: { select: { opportunites: true } } },
    });
    if (!item)
      throw new NotFoundException(`Type opportunité #${id} introuvable`);
    return item;
  }

  async createTypeOpportunite(data: Record<string, unknown>) {
    return this.prisma.typeOpportunite.create({
      data: data as Parameters<
        typeof this.prisma.typeOpportunite.create
      >[0]['data'],
    });
  }

  async updateTypeOpportunite(id: string, data: Record<string, unknown>) {
    await this.findOneTypeOpportunite(id);
    return this.prisma.typeOpportunite.update({ where: { id }, data });
  }

  async removeTypeOpportunite(id: string) {
    await this.findOneTypeOpportunite(id);
    return this.prisma.typeOpportunite.delete({ where: { id } });
  }

  // ─── Catégories FAQ ─────────────────────────────────────────────────────────

  async findAllCategorieFaqs() {
    return this.prisma.categorieFaq.findMany({
      orderBy: { ordre: 'asc' },
      include: { _count: { select: { faqs: true } } },
    });
  }

  async findOneCategorieFaq(id: string) {
    const item = await this.prisma.categorieFaq.findUnique({
      where: { id },
      include: { _count: { select: { faqs: true } } },
    });
    if (!item) throw new NotFoundException(`Catégorie FAQ #${id} introuvable`);
    return item;
  }

  async createCategorieFaq(data: Record<string, unknown>) {
    return this.prisma.categorieFaq.create({
      data: data as Parameters<
        typeof this.prisma.categorieFaq.create
      >[0]['data'],
    });
  }

  async updateCategorieFaq(id: string, data: Record<string, unknown>) {
    await this.findOneCategorieFaq(id);
    return this.prisma.categorieFaq.update({ where: { id }, data });
  }

  async removeCategorieFaq(id: string) {
    await this.findOneCategorieFaq(id);
    return this.prisma.categorieFaq.delete({ where: { id } });
  }

  // ─── Secteurs ───────────────────────────────────────────────────────────────

  async findAllSecteurs() {
    return this.prisma.secteur.findMany({
      orderBy: { nom: 'asc' },
      include: { _count: { select: { projets: true, indicateurs: true } } },
    });
  }

  async findOneSecteur(id: string) {
    const item = await this.prisma.secteur.findUnique({
      where: { id },
      include: { _count: { select: { projets: true, indicateurs: true } } },
    });
    if (!item) throw new NotFoundException(`Secteur #${id} introuvable`);
    return item;
  }

  async createSecteur(data: Record<string, unknown>) {
    return this.prisma.secteur.create({
      data: data as Parameters<typeof this.prisma.secteur.create>[0]['data'],
    });
  }

  async updateSecteur(id: string, data: Record<string, unknown>) {
    await this.findOneSecteur(id);
    return this.prisma.secteur.update({ where: { id }, data });
  }

  async removeSecteur(id: string) {
    await this.findOneSecteur(id);
    return this.prisma.secteur.delete({ where: { id } });
  }

  // ─── Départements ───────────────────────────────────────────────────────────

  async findAllDepartements() {
    return this.prisma.departement.findMany({
      orderBy: { nom: 'asc' },
      include: {
        communes: true,
        _count: { select: { projets: true, indicateurs: true } },
      },
    });
  }

  async findOneDepartement(id: string) {
    const item = await this.prisma.departement.findUnique({
      where: { id },
      include: {
        communes: true,
        _count: { select: { projets: true, indicateurs: true } },
      },
    });
    if (!item) throw new NotFoundException(`Département #${id} introuvable`);
    return item;
  }

  async createDepartement(data: Record<string, unknown>) {
    return this.prisma.departement.create({
      data: data as Parameters<
        typeof this.prisma.departement.create
      >[0]['data'],
    });
  }

  async updateDepartement(id: string, data: Record<string, unknown>) {
    await this.findOneDepartement(id);
    return this.prisma.departement.update({ where: { id }, data });
  }

  async removeDepartement(id: string) {
    await this.findOneDepartement(id);
    return this.prisma.departement.delete({ where: { id } });
  }

  // ─── Arrondissements ────────────────────────────────────────────────────────

  async findAllArrondissements(departementId?: string) {
    return this.prisma.arrondissement.findMany({
      where: departementId ? { departementId } : undefined,
      orderBy: { nom: 'asc' },
      include: {
        departement: { select: { id: true, nom: true } },
        _count: { select: { communes: true } },
      },
    });
  }

  async findOneArrondissement(id: string) {
    const item = await this.prisma.arrondissement.findUnique({
      where: { id },
      include: {
        departement: { select: { id: true, nom: true } },
        communes: true,
      },
    });
    if (!item) throw new NotFoundException(`Arrondissement #${id} introuvable`);
    return item;
  }

  async createArrondissement(data: Record<string, unknown>) {
    return this.prisma.arrondissement.create({
      data: data as Parameters<
        typeof this.prisma.arrondissement.create
      >[0]['data'],
    });
  }

  async updateArrondissement(id: string, data: Record<string, unknown>) {
    await this.findOneArrondissement(id);
    return this.prisma.arrondissement.update({ where: { id }, data });
  }

  async removeArrondissement(id: string) {
    await this.findOneArrondissement(id);
    return this.prisma.arrondissement.delete({ where: { id } });
  }

  // ─── Communes ───────────────────────────────────────────────────────────────

  async findAllCommunes(departementId?: string, arrondissementId?: string) {
    const where: Record<string, string> = {};
    if (departementId) where.departementId = departementId;
    if (arrondissementId) where.arrondissementId = arrondissementId;
    return this.prisma.commune.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { nom: 'asc' },
      include: {
        departement: { select: { id: true, nom: true } },
        arrondissement: { select: { id: true, nom: true } },
        _count: { select: { projets: true, indicateurs: true } },
      },
    });
  }

  async findOneCommune(id: string) {
    const item = await this.prisma.commune.findUnique({
      where: { id },
      include: {
        departement: { select: { id: true, nom: true } },
        arrondissement: { select: { id: true, nom: true } },
        _count: { select: { projets: true, indicateurs: true } },
      },
    });
    if (!item) throw new NotFoundException(`Commune #${id} introuvable`);
    return item;
  }

  async createCommune(data: Record<string, unknown>) {
    return this.prisma.commune.create({
      data: data as Parameters<typeof this.prisma.commune.create>[0]['data'],
    });
  }

  async updateCommune(id: string, data: Record<string, unknown>) {
    await this.findOneCommune(id);
    return this.prisma.commune.update({ where: { id }, data });
  }

  async removeCommune(id: string) {
    await this.findOneCommune(id);
    return this.prisma.commune.delete({ where: { id } });
  }

  // ─── Services (organisation interne) ────────────────────────────────────────

  async findAllServices() {
    return this.prisma.service.findMany({
      orderBy: { ordre: 'asc' },
    });
  }

  async findOneService(id: string) {
    const item = await this.prisma.service.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Service #${id} introuvable`);
    return item;
  }

  async createService(data: Record<string, unknown>) {
    return this.prisma.service.create({
      data: data as Parameters<typeof this.prisma.service.create>[0]['data'],
    });
  }

  async updateService(id: string, data: Record<string, unknown>) {
    await this.findOneService(id);
    return this.prisma.service.update({ where: { id }, data });
  }

  async removeService(id: string) {
    await this.findOneService(id);
    return this.prisma.service.delete({ where: { id } });
  }

  // ─── Chiffres clés ──────────────────────────────────────────────────────────

  async findAllChiffresCles() {
    // Les chiffres clés sont pilotés par les admins via la table chiffres_cles.
    // TOUTE entrée active de la table est renvoyée telle quelle (label libre).
    // En complément, pour les labels standard absents de la table, on calcule
    // automatiquement des valeurs fiables (départements, partenaires actifs,
    // années d'expérience). "Projets réalisés" n'est JAMAIS calculé : il doit
    // être renseigné manuellement pour refléter la réalité de l'ARD.
    const [partenairesActifs, departements, manuels] = await Promise.all([
      this.prisma.partenaire.count({ where: { statut: 'actif' } }),
      this.prisma.departement.count(),
      this.prisma.chiffreCle.findMany({
        orderBy: { ordre: 'asc' },
        where: { actif: true },
      }),
    ]);

    // Année de création de l'ARD de Ziguinchor (cf. page "à propos").
    const ANNEE_CREATION = 2001;
    const anneesExperience = Math.max(
      new Date().getFullYear() - ANNEE_CREATION,
      0,
    );

    // Valeurs calculées par défaut pour les labels standard non renseignés en base.
    const autoByLabel = new Map<string, { valeur: string; icone: string }>([
      ['partenaires actifs',   { valeur: `${partenairesActifs}+`, icone: '🤝' }],
      ['départements couverts',{ valeur: `${departements}`,      icone: '🗺️' }],
      ['années d\'expérience', { valeur: `${anneesExperience}+`, icone: '📅' }],
    ]);

    // 1) Toutes les entrées manuelles actives, telles quelles (libellé libre).
    const result: Array<Record<string, unknown>> = [];
    const usedLabels = new Set<string>();

    // Emojis suggérés par libellé, utilisés comme icône par défaut si l'admin
    // n'en a pas renseigné pour une entrée manuelle.
    const iconByLabel: Record<string, string> = {
      'projets réalisés': '🏗️',
      'projet réalisé': '🏗️',
      'projet réalisés': '🏗️',
      'partenaires actifs': '🤝',
      'partenaire actif': '🤝',
      'départements couverts': '🗺️',
      'communes': '🏘️',
      'années d\'expérience': '📅',
      'bénéficiaires': '👥',
      'emplois créés': '💼',
      'financements mobilisés': '💰',
      'formations': '🎓',
    };

    for (const m of manuels) {
      if (!m.label) continue;
      const labelKey = m.label.toLowerCase().trim();
      usedLabels.add(labelKey);
      result.push({
        id: m.id,
        label: m.label,
        valeur: m.valeur,
        icone: m.icone?.trim() ? m.icone : (iconByLabel[labelKey] ?? '📊'),
        description: m.description ?? null,
        ordre: m.ordre ?? result.length + 1,
      });
    }

    // 2) Complète avec les valeurs calculées pour les labels standard absents.
    for (const [labelKey, auto] of autoByLabel.entries()) {
      if (usedLabels.has(labelKey)) continue;
      result.push({
        id: `auto-${labelKey}`,
        label: labelKey,
        valeur: auto.valeur,
        icone: auto.icone,
        description: null,
        ordre: result.length + 1,
      });
    }

    return result;
  }

  /** Retourne les vrais enregistrements de la table (sans calculs auto) — usage admin. */
  async findAllChiffresClesRaw() {
    return this.prisma.chiffreCle.findMany({
      orderBy: { ordre: 'asc' },
    });
  }

  async findOneChiffreCle(id: string) {
    const item = await this.prisma.chiffreCle.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Chiffre clé #${id} introuvable`);
    return item;
  }

  async createChiffreCle(data: Record<string, unknown>) {
    return this.prisma.chiffreCle.create({
      data: data as Parameters<typeof this.prisma.chiffreCle.create>[0]['data'],
    });
  }

  async updateChiffreCle(id: string, data: Record<string, unknown>) {
    await this.findOneChiffreCle(id);
    return this.prisma.chiffreCle.update({ where: { id }, data });
  }

  async removeChiffreCle(id: string) {
    await this.findOneChiffreCle(id);
    return this.prisma.chiffreCle.delete({ where: { id } });
  }

  // ─── Témoignages ────────────────────────────────────────────────────────────

  async findAllTemoignages() {
    return this.prisma.temoignage.findMany({
      orderBy: { ordre: 'asc' },
      where: { actif: true },
    });
  }

  async findOneTemoignage(id: string) {
    const item = await this.prisma.temoignage.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Témoignage #${id} introuvable`);
    return item;
  }

  async createTemoignage(data: Record<string, unknown>) {
    return this.prisma.temoignage.create({
      data: data as Parameters<typeof this.prisma.temoignage.create>[0]['data'],
    });
  }

  async updateTemoignage(id: string, data: Record<string, unknown>) {
    await this.findOneTemoignage(id);
    return this.prisma.temoignage.update({ where: { id }, data });
  }

  async removeTemoignage(id: string) {
    await this.findOneTemoignage(id);
    return this.prisma.temoignage.delete({ where: { id } });
  }

  // ─── Bannières ──────────────────────────────────────────────────────────────

  async findAllBannieres() {
    return this.prisma.banniere.findMany({
      orderBy: { ordre: 'asc' },
      where: { actif: true },
    });
  }

  async findOneBanniere(id: string) {
    const item = await this.prisma.banniere.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Bannière #${id} introuvable`);
    return item;
  }

  async createBanniere(data: Record<string, unknown>) {
    return this.prisma.banniere.create({
      data: data as Parameters<typeof this.prisma.banniere.create>[0]['data'],
    });
  }

  async updateBanniere(id: string, data: Record<string, unknown>) {
    await this.findOneBanniere(id);
    return this.prisma.banniere.update({ where: { id }, data });
  }

  async removeBanniere(id: string) {
    await this.findOneBanniere(id);
    return this.prisma.banniere.delete({ where: { id } });
  }

  // ─── Menus ──────────────────────────────────────────────────────────────────

  async findAllMenus() {
    return this.prisma.menu.findMany({
      orderBy: { ordre: 'asc' },
      where: { actif: true },
    });
  }

  async findOneMenu(id: string) {
    const item = await this.prisma.menu.findUnique({ where: { id } });
    if (!item) throw new NotFoundException(`Menu #${id} introuvable`);
    return item;
  }

  async createMenu(data: Record<string, unknown>) {
    return this.prisma.menu.create({
      data: data as Parameters<typeof this.prisma.menu.create>[0]['data'],
    });
  }

  async updateMenu(id: string, data: Record<string, unknown>) {
    await this.findOneMenu(id);
    return this.prisma.menu.update({ where: { id }, data });
  }

  async removeMenu(id: string) {
    await this.findOneMenu(id);
    return this.prisma.menu.delete({ where: { id } });
  }

  // ─── Réseaux sociaux ────────────────────────────────────────────────────────

  async findAllReseauxSociaux() {
    return this.prisma.reseauSocial.findMany({
      orderBy: { ordre: 'asc' },
      where: { actif: true },
      include: { partenaire: { select: { id: true, nom: true } } },
    });
  }

  async findOneReseauSocial(id: string) {
    const item = await this.prisma.reseauSocial.findUnique({
      where: { id },
      include: { partenaire: { select: { id: true, nom: true } } },
    });
    if (!item) throw new NotFoundException(`Réseau social #${id} introuvable`);
    return item;
  }

  async createReseauSocial(data: Record<string, unknown>) {
    return this.prisma.reseauSocial.create({
      data: data as Parameters<
        typeof this.prisma.reseauSocial.create
      >[0]['data'],
    });
  }

  async updateReseauSocial(id: string, data: Record<string, unknown>) {
    await this.findOneReseauSocial(id);
    return this.prisma.reseauSocial.update({ where: { id }, data });
  }

  async removeReseauSocial(id: string) {
    await this.findOneReseauSocial(id);
    return this.prisma.reseauSocial.delete({ where: { id } });
  }

  // ─── Contenus éditoriaux ───────────────────────────────────────────────────
  // Textes et listes affichés sur le site, gérés depuis Paramètres (admin).
  // `type` = nature du bloc, `section` = page/emplacement qui le consomme.

  async findAllContenusEditoriaux(params?: {
    type?: string;
    section?: string;
    includeInactifs?: boolean;
  }) {
    return this.prisma.contenuEditorial.findMany({
      where: {
        ...(params?.type ? { type: params.type } : {}),
        ...(params?.section ? { section: params.section } : {}),
        ...(params?.includeInactifs ? {} : { actif: true }),
      },
      orderBy: [{ ordre: 'asc' }, { titre: 'asc' }],
    });
  }

  async findOneContenuEditorial(id: string) {
    const item = await this.prisma.contenuEditorial.findUnique({
      where: { id },
    });
    if (!item)
      throw new NotFoundException(`Contenu éditorial #${id} introuvable`);
    return item;
  }

  async createContenuEditorial(data: Record<string, unknown>) {
    return this.prisma.contenuEditorial.create({
      data: data as Parameters<
        typeof this.prisma.contenuEditorial.create
      >[0]['data'],
    });
  }

  async updateContenuEditorial(id: string, data: Record<string, unknown>) {
    await this.findOneContenuEditorial(id);
    return this.prisma.contenuEditorial.update({ where: { id }, data });
  }

  async removeContenuEditorial(id: string) {
    await this.findOneContenuEditorial(id);
    return this.prisma.contenuEditorial.delete({ where: { id } });
  }

  // ─── Paramètres du site ─────────────────────────────────────────────────────

  async findParametresSite() {
    const parametres = await this.prisma.parametreSite.findFirst();
    return parametres;
  }

  async updateParametresSite(data: Record<string, unknown>) {
    const existant = await this.prisma.parametreSite.findFirst();
    if (existant) {
      return this.prisma.parametreSite.update({
        where: { id: existant.id },
        data,
      });
    }
        return this.prisma.parametreSite.create({
      data: data,
    });
  }

  // ─── Contenus statiques ─────────────────────────────────────────────────────
  // Textes institutionnels adressables par clé (mentions légales, etc.).
  // Une page publique lit son texte par clé : si la clé n'existe ou est désactivée,
  // on renvoie null et l'interface utilise son repli codé en dur.

  async findContenuStatiqueByCle(cle: string) {
    const item = await this.prisma.contenuStatique.findUnique({
      where: { cle, actif: true },
    });
    // null → la page publique bascule sur son fallback (jamais de page blanche).
    return item ?? null;
  }

  async findAllContenusStatiques(includeInactifs = false) {
    return this.prisma.contenuStatique.findMany({
      where: includeInactifs ? {} : { actif: true },
      orderBy: { cle: 'asc' },
    });
  }

  async createContenuStatique(data: {
    cle: string;
    titre?: string;
    contenu: string;
    actif?: boolean;
  }) {
    return this.prisma.contenuStatique.create({
      data: {
        cle: data.cle,
        titre: data.titre ?? null,
        contenu: data.contenu,
        actif: data.actif ?? true,
      },
    });
  }

  async updateContenuStatique(
    id: string,
    data: { titre?: string; contenu?: string; actif?: boolean },
  ) {
    const existing = await this.prisma.contenuStatique.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Contenu statique #${id} introuvable`);
    return this.prisma.contenuStatique.update({ where: { id }, data });
  }

  async removeContenuStatique(id: string) {
    const existing = await this.prisma.contenuStatique.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Contenu statique #${id} introuvable`);
    return this.prisma.contenuStatique.delete({ where: { id } });
  }

  // ─── Navigation ──────────────────────────────────────────────────────────────
  // Menu du site (header / footer / juridique). Retourne une liste plate
  // ; le frontend construit l'arbre à partir de `parentId`.

  async findAllNavigation(
    section?: string,
    includeInactifs = false,
  ) {
    return this.prisma.navigationItem.findMany({
      where: {
        ...(section ? { section } : {}),
        ...(includeInactifs ? {} : { actif: true }),
      },
      orderBy: [{ section: 'asc' }, { ordre: 'asc' }, { label: 'asc' }],
    });
  }

  async createNavigationItem(data: {
    label: string;
    href: string;
    icone?: string;
    ordre?: number;
    parentId?: string;
    section?: string;
    actif?: boolean;
  }) {
    return this.prisma.navigationItem.create({
      data: {
        label: data.label,
        href: data.href,
        icone: data.icone ?? null,
        ordre: data.ordre ?? 0,
        parentId: data.parentId ?? null,
        section: data.section ?? 'header',
        actif: data.actif ?? true,
      },
    });
  }

  async updateNavigationItem(
    id: string,
    data: {
      label?: string;
      href?: string;
      icone?: string;
      ordre?: number;
      parentId?: string;
      section?: string;
      actif?: boolean;
    },
  ) {
    const existing = await this.prisma.navigationItem.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Élément de navigation #${id} introuvable`);
    return this.prisma.navigationItem.update({ where: { id }, data });
  }

  async removeNavigationItem(id: string) {
    const existing = await this.prisma.navigationItem.findUnique({
      where: { id },
    });
    if (!existing)
      throw new NotFoundException(`Élément de navigation #${id} introuvable`);
    // Les éventuels enfants sont "désassignés" (parentId → null) plutôt supprimés.
    await this.prisma.navigationItem.updateMany({
      where: { parentId: id },
      data: { parentId: null },
    });
    return this.prisma.navigationItem.delete({ where: { id } });
  }
}
