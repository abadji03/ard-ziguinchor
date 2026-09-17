// Typologie des documents de planification (LOADT 2021, Loi SNP 2022-10,
// Code de l'urbanisme 2023-20 + instruments historiques).
// Utilisée par les formulaires admin Documents.

export const TYPE_PLANIFICATION_OPTIONS: { value: string; label: string }[] = [
  { value: 'REGIONALE',    label: 'Planification régionale' },
  { value: 'TERRITORIALE', label: 'Planification territoriale (développement & aménagement)' },
  { value: 'URBAIN',       label: 'Planification urbaine & opérations d\u2019aménagement' },
  { value: 'SECTORIEL',    label: 'Planification sectorielle' },
  { value: 'ENVIRONNEMENT',label: 'Environnement, climat & risques' },
  { value: 'HISTORIQUE',   label: 'Documents historiques / antérieurs' },
  { value: 'AUTRE',        label: 'Autre document' },
];

// Sous-types proposés selon le type de planification choisi.
export const SOUSTYPES_PAR_TYPE: Record<string, { value: string; label: string }[]> = {
  REGIONALE: [
    { value: 'PRD',   label: 'PRD — Plan Régional de Développement' },
    { value: 'Schema',label: 'Schéma / stratégie régionale sectorielle' },
    { value: 'Autre', label: 'Autre document régional' },
  ],
  TERRITORIALE: [
    { value: 'PDC',     label: 'PDC — Plan de Développement Communal' },
    { value: 'PDD',     label: 'PDD — Plan Départemental de Développement' },
    { value: 'PDV',     label: 'PDV — Plan de Développement de la Ville' },
    { value: 'SDADT',   label: 'SDADT — Schéma Départemental d\u2019Aménagement et de Développement Territorial' },
    { value: 'SCADT',   label: 'SCADT — Schéma Communal d\u2019Aménagement et de Développement Territorial' },
    { value: 'SCOT',    label: 'SCOT — Schéma de Cohérence Territoriale (interterritorial)' },
    { value: 'SDADT-ZS',label: 'SDADT-ZS — Schéma directeur des zones spécifiques' },
    { value: 'POAS',    label: 'POAS — Plan d\u2019Occupation et d\u2019Affectation des Sols' },
  ],
  URBAIN: [
    { value: 'SDAU',          label: 'SDAU — Schéma Directeur d\u2019Aménagement et d\u2019Urbanisme' },
    { value: 'PCU',           label: 'PCU — Plan Communal d\u2019Urbanisme' },
    { value: 'PCUI',          label: 'PCUI — Plan Communal ou Intercommunal d\u2019Urbanisme' },
    { value: 'PUPA',          label: 'PUPA — Plan d\u2019Urbanisme des Petites Agglomérations' },
    { value: 'PAZ',           label: 'PAZ — Plan d\u2019Aménagement de Zone' },
    { value: 'Lotissement',   label: 'Plan de lotissement' },
  ],
  SECTORIEL: [
    { value: 'LPSD',  label: 'LPSD — Lettre de Politique Sectorielle de Développement' },
    { value: 'SDS',   label: 'SDS — Schéma Directeur Sectoriel' },
    { value: 'PlanSectoriel', label: 'Plan / programme sectoriel (santé, éducation, agriculture…)' },
  ],
  ENVIRONNEMENT: [
    { value: 'PGE',    label: 'Plan de gestion environnementale' },
    { value: 'PGDRN',  label: 'Plan de gestion des ressources naturelles / aires protégées' },
    { value: 'PlanClimat', label: 'Plan climat / adaptation au changement climatique' },
    { value: 'ORSEC',  label: 'Plan ORSEC / plan de contingence / gestion des risques' },
  ],
  HISTORIQUE: [
    { value: 'SRAT', label: 'SRAT — Schéma Régional d\u2019Aménagement du Territoire (historique)' },
    { value: 'PRDI', label: 'PRDI — Plan Régional de Développement Intégré (historique)' },
    { value: 'PIC',  label: 'PIC — Plan d\u2019Investissement Communal (historique)' },
    { value: 'PLD',  label: 'PLD — Plan Local de Développement (historique)' },
    { value: 'PAR',  label: 'PAR — Plan d\u2019Action Régional (historique)' },
    { value: 'PIL',  label: 'PIL — Programme d\u2019Investissement Local (historique)' },
    { value: 'PVD',  label: 'PVD / PDV villageois — Plan Villageois de Développement' },
    { value: 'PZD',  label: 'PZD — Plan Zonal de Développement' },
  ],
  AUTRE: [],
};

// Familles exigeant un ciblage territorial (département/commune).
export const TYPES_REQUIRANT_TERRITOIRE = ['TERRITORIALE', 'URBAIN', 'HISTORIQUE', 'ENVIRONNEMENT', 'SECTORIEL'];

// Familles exigeant un sous-type.
export const TYPES_REQUIRANT_SOUSTYPE = ['REGIONALE', 'TERRITORIALE', 'URBAIN', 'SECTORIEL', 'ENVIRONNEMENT', 'HISTORIQUE'];