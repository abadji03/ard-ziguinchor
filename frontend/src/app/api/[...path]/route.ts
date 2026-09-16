import { NextRequest, NextResponse } from 'next/server';
import {
  mockParametresSite,
  mockChiffresCles,
  mockBannieres,
  mockSecteurs,
  mockCategoriesActualite,
  mockCategoriesDocument,
  mockTypesOpportunite,
  mockTypesPartenaires,
  mockDepartements,
  mockArrondissements,
  mockCommunes,
  mockProgrammes,
  mockProjets,
  mockActualites,
  mockOpportunites,
  mockPartenaires,
  mockEvenements,
  mockDocuments,
  mockFaqs,
  mockMembres,
  mockIndicateurs,
  mockGalerie,
} from '@/lib/mock-data';

// In-memory collections for active session modifications
const actualitesStore: any[] = [...mockActualites];
const projetsStore: any[] = [...mockProjets];
const programmesStore: any[] = [...mockProgrammes];
const opportunitesStore: any[] = [...mockOpportunites];
const partenairesStore: any[] = [...mockPartenaires];
const documentsStore: any[] = [...mockDocuments];

function paginate<T>(items: T[], page = 1, limit = 10) {
  const p = Math.max(1, Number(page) || 1);
  const l = Math.max(1, Number(limit) || 10);
  const start = (p - 1) * l;
  const data = items.slice(start, start + l);
  return {
    data,
    total: items.length,
    page: p,
    limit: l,
    totalPages: Math.ceil(items.length / l) || 1,
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await context.params;
  const subpath = path.join('/');
  const { searchParams } = new URL(request.url);

  // References & Parameters
  if (subpath === 'references/parametres-site') {
    return NextResponse.json(mockParametresSite);
  }
  if (subpath === 'references/chiffres-cles') {
    return NextResponse.json(mockChiffresCles);
  }
  if (subpath === 'references/bannieres') {
    return NextResponse.json(mockBannieres);
  }
  if (subpath === 'references/secteurs') {
    return NextResponse.json(mockSecteurs);
  }
  if (subpath === 'references/types-partenaires') {
    return NextResponse.json(mockTypesPartenaires);
  }
  if (subpath === 'references/types-opportunites') {
    return NextResponse.json(mockTypesOpportunite);
  }

  // Territorial data
  if (subpath === 'references/departements') {
    return NextResponse.json(mockDepartements);
  }
  if (subpath.startsWith('references/departements/')) {
    const parts = subpath.split('/');
    const deptIdOrCode = parts[2];
    if (parts[3] === 'arrondissements') {
      const arrs = mockArrondissements.filter(
        (a) => a.departementId === deptIdOrCode || a.code.startsWith(deptIdOrCode.toUpperCase())
      );
      return NextResponse.json(arrs);
    }
    if (parts[3] === 'communes') {
      const coms = mockCommunes.filter(
        (c) => c.departementId === deptIdOrCode || c.departement?.code === deptIdOrCode.toUpperCase()
      );
      return NextResponse.json(coms);
    }
    const dept = mockDepartements.find((d) => d.id === deptIdOrCode || d.code.toLowerCase() === deptIdOrCode.toLowerCase());
    return dept ? NextResponse.json(dept) : NextResponse.json({ error: 'Département introuvable' }, { status: 404 });
  }

  if (subpath === 'references/arrondissements') {
    const deptId = searchParams.get('departementId');
    const filtered = deptId ? mockArrondissements.filter((a) => a.departementId === deptId) : mockArrondissements;
    return NextResponse.json(filtered);
  }
  if (subpath.startsWith('references/arrondissements/')) {
    const parts = subpath.split('/');
    const arrId = parts[2];
    if (parts[3] === 'communes') {
      const coms = mockCommunes.filter((c) => c.arrondissementId === arrId);
      return NextResponse.json(coms);
    }
    const arr = mockArrondissements.find((a) => a.id === arrId);
    return arr ? NextResponse.json(arr) : NextResponse.json({ error: 'Arrondissement introuvable' }, { status: 404 });
  }

  if (subpath === 'references/communes') {
    const deptId = searchParams.get('departementId');
    const arrId = searchParams.get('arrondissementId');
    let coms = mockCommunes;
    if (deptId) coms = coms.filter((c) => c.departementId === deptId);
    if (arrId) coms = coms.filter((c) => c.arrondissementId === arrId);
    return NextResponse.json(coms);
  }
  if (subpath.startsWith('references/communes/')) {
    const comId = subpath.split('/')[2];
    const com = mockCommunes.find((c) => c.id === comId || c.code.toLowerCase() === comId.toLowerCase());
    return com ? NextResponse.json(com) : NextResponse.json({ error: 'Commune introuvable' }, { status: 404 });
  }

  // FAQ & Membres
  if (subpath === 'faq') {
    return NextResponse.json({ data: mockFaqs });
  }
  if (subpath === 'membres') {
    return NextResponse.json({ data: mockMembres });
  }
  if (subpath.startsWith('membres/')) {
    const mId = subpath.split('/')[1];
    const m = mockMembres.find((x) => x.id === mId);
    return m ? NextResponse.json(m) : NextResponse.json({ error: 'Membre introuvable' }, { status: 404 });
  }

  // Actualités
  if (subpath === 'actualites/recentes') {
    const limit = Number(searchParams.get('limit')) || 3;
    return NextResponse.json(actualitesStore.slice(0, limit));
  }
  if (subpath === 'actualites/alaune') {
    return NextResponse.json(actualitesStore.slice(0, 3));
  }
  if (subpath === 'actualites/categories') {
    return NextResponse.json(mockCategoriesActualite);
  }
  if (subpath.startsWith('actualites/')) {
    const slugOrId = subpath.split('/')[1];
    const act = actualitesStore.find((a) => a.slug === slugOrId || a.id === slugOrId);
    return act ? NextResponse.json(act) : NextResponse.json({ error: 'Actualité introuvable' }, { status: 404 });
  }
  if (subpath === 'actualites') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;
    const search = searchParams.get('search')?.toLowerCase();
    const categorie = searchParams.get('categorie');
    let items = actualitesStore;
    if (search) {
      items = items.filter(
        (a) => a.titre.toLowerCase().includes(search) || a.contenu.toLowerCase().includes(search)
      );
    }
    if (categorie) {
      items = items.filter((a) => a.categorie?.slug === categorie || a.categorie?.id === categorie);
    }
    return NextResponse.json(paginate(items, page, limit));
  }

  // Projets
  if (subpath === 'projets/recents') {
    const limit = Number(searchParams.get('limit')) || 3;
    return NextResponse.json(projetsStore.slice(0, limit));
  }
  if (subpath === 'projets/statistiques') {
    return NextResponse.json({
      total: projetsStore.length,
      encours: projetsStore.filter((p) => p.statut === 'encours').length,
      planifie: projetsStore.filter((p) => p.statut === 'planifie').length,
      realise: projetsStore.filter((p) => p.statut === 'realise').length,
      suspendu: projetsStore.filter((p) => p.statut === 'suspendu').length,
      totalBudget: projetsStore.reduce((acc, p) => acc + (p.budget || 0), 0),
      totalBeneficiaires: projetsStore.reduce((acc, p) => acc + (p.beneficiaires || 0), 0),
    });
  }
  if (subpath.startsWith('projets/')) {
    const slugOrId = subpath.split('/')[1];
    const proj = projetsStore.find((p) => p.slug === slugOrId || p.id === slugOrId);
    return proj ? NextResponse.json(proj) : NextResponse.json({ error: 'Projet introuvable' }, { status: 404 });
  }
  if (subpath === 'projets') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;
    const statut = searchParams.get('statut');
    const secteur = searchParams.get('secteur');
    let items = projetsStore;
    if (statut) items = items.filter((p) => p.statut === statut);
    if (secteur) items = items.filter((p) => p.secteur?.slug === secteur || p.secteurId === secteur);
    return NextResponse.json(paginate(items, page, limit));
  }

  // Programmes
  if (subpath === 'programmes/actifs') {
    return NextResponse.json(programmesStore.filter((p) => p.statut === 'actif'));
  }
  if (subpath.startsWith('programmes/')) {
    const slugOrId = subpath.split('/')[1];
    const prog = programmesStore.find((p) => p.slug === slugOrId || p.id === slugOrId);
    return prog ? NextResponse.json(prog) : NextResponse.json({ error: 'Programme introuvable' }, { status: 404 });
  }
  if (subpath === 'programmes') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;
    return NextResponse.json(paginate(programmesStore, page, limit));
  }

  // Opportunités
  if (subpath === 'opportunites/ouvertes') {
    return NextResponse.json(opportunitesStore.filter((o) => o.statut === 'ouvert'));
  }
  if (subpath.startsWith('opportunites/')) {
    const slugOrId = subpath.split('/')[1];
    const opp = opportunitesStore.find((o) => o.slug === slugOrId || o.id === slugOrId);
    return opp ? NextResponse.json(opp) : NextResponse.json({ error: 'Opportunité introuvable' }, { status: 404 });
  }
  if (subpath === 'opportunites') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 9;
    return NextResponse.json(paginate(opportunitesStore, page, limit));
  }

  // Partenaires
  if (subpath === 'partenaires/actifs') {
    return NextResponse.json(partenairesStore.filter((p) => p.statut === 'actif'));
  }
  if (subpath.startsWith('partenaires/')) {
    const slugOrId = subpath.split('/')[1];
    const part = partenairesStore.find((p) => p.slug === slugOrId || p.id === slugOrId);
    return part ? NextResponse.json(part) : NextResponse.json({ error: 'Partenaire introuvable' }, { status: 404 });
  }
  if (subpath === 'partenaires') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 12;
    return NextResponse.json(paginate(partenairesStore, page, limit));
  }

  // Événements
  if (subpath === 'evenements/a-venir') {
    const limit = Number(searchParams.get('limit')) || 4;
    return NextResponse.json(mockEvenements.slice(0, limit));
  }
  if (subpath.startsWith('evenements/')) {
    const slugOrId = subpath.split('/')[1];
    const evt = mockEvenements.find((e) => e.slug === slugOrId || e.id === slugOrId);
    return evt ? NextResponse.json(evt) : NextResponse.json({ error: 'Événement introuvable' }, { status: 404 });
  }
  if (subpath === 'evenements') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    return NextResponse.json(paginate(mockEvenements, page, limit));
  }

  // Documents
  if (subpath === 'documents/recents') {
    return NextResponse.json(documentsStore.slice(0, 4));
  }
  if (subpath === 'documents/territoriale') {
    return NextResponse.json(documentsStore.filter((d) => d.estTerritoriale));
  }
  if (subpath === 'documents/categories') {
    return NextResponse.json(mockCategoriesDocument);
  }
  if (subpath.startsWith('documents/') && subpath.endsWith('/download')) {
    return NextResponse.json({ success: true, message: 'Téléchargement initié' });
  }
  if (subpath.startsWith('documents/')) {
    const docId = subpath.split('/')[1];
    const doc = documentsStore.find((d) => d.id === docId || d.slug === docId);
    return doc ? NextResponse.json(doc) : NextResponse.json({ error: 'Document introuvable' }, { status: 404 });
  }
  if (subpath === 'documents') {
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    return NextResponse.json(paginate(documentsStore, page, limit));
  }

  // Galerie & Indicateurs
  if (subpath === 'galeries' || subpath === 'galerie') {
    return NextResponse.json({ data: mockGalerie });
  }
  if (subpath === 'indicateurs') {
    return NextResponse.json({ data: mockIndicateurs });
  }

  // Recherche
  if (subpath === 'recherche') {
    const query = searchParams.get('q')?.toLowerCase() || '';
    const filteredActu = actualitesStore.filter((a) => a.titre.toLowerCase().includes(query) || a.resume?.toLowerCase().includes(query));
    const filteredProj = projetsStore.filter((p) => p.titre.toLowerCase().includes(query) || p.resume?.toLowerCase().includes(query));
    const filteredProg = programmesStore.filter((p) => p.nom.toLowerCase().includes(query) || p.resume?.toLowerCase().includes(query));
    const filteredOpp = opportunitesStore.filter((o) => o.titre.toLowerCase().includes(query) || o.resume?.toLowerCase().includes(query));
    return NextResponse.json({
      actualites: filteredActu,
      projets: filteredProj,
      programmes: filteredProg,
      opportunites: filteredOpp,
    });
  }

  // Auth & Admin
  if (subpath === 'auth/me') {
    return NextResponse.json({
      id: 'usr-admin',
      email: 'admin@ard-ziguinchor.com',
      nom: 'Admin',
      prenom: 'Super Admin',
      role: 'SUPER_ADMIN',
      poste: "Directeur de l'agence",
    });
  }
  if (subpath === 'admin/stats' || subpath === 'admin/dashboard') {
    return NextResponse.json({
      actualitesCount: actualitesStore.length,
      projetsCount: projetsStore.length,
      programmesCount: programmesStore.length,
      opportunitesCount: opportunitesStore.length,
      documentsCount: documentsStore.length,
      partenairesCount: partenairesStore.length,
      communesCount: mockCommunes.length,
      departementsCount: mockDepartements.length,
    });
  }
  if (subpath === 'audit') {
    return NextResponse.json({
      data: [
        { id: 'aud-1', action: 'CONNEXION', entite: 'User', details: 'Connexion de Super Admin', createdAt: new Date().toISOString() },
        { id: 'aud-2', action: 'MISE_A_JOUR', entite: 'Projet', details: 'Mise à jour avancement Vallée de Mpack', createdAt: new Date().toISOString() },
      ],
    });
  }

  // Default fallback for any other GET endpoint
  return NextResponse.json({ message: 'OK', data: [] });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await context.params;
  const subpath = path.join('/');

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Body is empty or form-data
  }

  if (subpath === 'auth/login') {
    const { email } = body;
    return NextResponse.json({
      access_token: 'mock-jwt-token-ard-ziguinchor-' + Date.now(),
      refresh_token: 'mock-refresh-token-' + Date.now(),
      user: {
        id: 'usr-admin',
        email: email || 'admin@ard-ziguinchor.com',
        nom: 'Admin',
        prenom: 'Super Admin',
        role: 'SUPER_ADMIN',
        poste: "Directeur de l'agence",
      },
    });
  }

  if (subpath === 'auth/refresh') {
    return NextResponse.json({
      access_token: 'mock-jwt-refreshed-' + Date.now(),
    });
  }

  if (subpath === 'auth/logout') {
    return NextResponse.json({ success: true });
  }

  if (subpath === 'contact') {
    return NextResponse.json({
      success: true,
      message: 'Votre message a bien été transmis aux équipes de l\'ARD Ziguinchor.',
    });
  }

  if (subpath.startsWith('documents/') && subpath.endsWith('/download')) {
    return NextResponse.json({ success: true, message: 'Téléchargement enregistré' });
  }

  // Admin creation endpoints
  if (subpath === 'actualites') {
    const newAct = {
      id: 'actu-' + Date.now(),
      titre: (body.titre as string) || 'Nouvelle actualité',
      slug: (body.slug as string) || 'actualite-' + Date.now(),
      resume: body.resume as string,
      contenu: (body.contenu as string) || '',
      statut: (body.statut as string) || 'publie',
      vue: 0,
      tags: (body.tags as string[]) || [],
      datePublication: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    actualitesStore.unshift(newAct);
    return NextResponse.json(newAct, { status: 201 });
  }

  if (subpath === 'projets') {
    const newProj = {
      id: 'proj-' + Date.now(),
      titre: (body.titre as string) || 'Nouveau projet',
      slug: (body.slug as string) || 'projet-' + Date.now(),
      resume: body.resume as string,
      description: (body.description as string) || '',
      statut: (body.statut as string) || 'planifie',
      niveauAvancement: Number(body.niveauAvancement) || 0,
      budget: Number(body.budget) || 0,
      beneficiaires: Number(body.beneficiaires) || 0,
    };
    projetsStore.unshift(newProj as any);
    return NextResponse.json(newProj, { status: 201 });
  }

  return NextResponse.json({ success: true, id: 'item-' + Date.now(), ...body }, { status: 201 });
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await context.params;
  const subpath = path.join('/');

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Empty
  }

  return NextResponse.json({ success: true, updated: subpath, ...body });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await context.params;
  const subpath = path.join('/');

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // Empty
  }

  return NextResponse.json({ success: true, patched: subpath, ...body });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path = [] } = await context.params;
  return NextResponse.json({ success: true, deleted: path.join('/') });
}
