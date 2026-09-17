// Directions / divisions de l'ARD de Ziguinchor.
// ⚠️ Structure fonctionnelle reconstituée à partir des sources documentaires
// (Division Planification/Formation, Division Suivi-Évaluation — BAD 2020 ;
// blocs fonctionnels PDEC/SDADT : planification, ingénierie/appui technique,
// suivi-évaluation, développement local & financement, administration).
// Ce n'est pas un organigramme officiel publié : la liste peut être ajustée
// lorsque l'organigramme officiel sera disponible.

export const DIRECTIONS_ARD: { value: string; label: string; description?: string }[] = [
  {
    value: 'Direction Générale',
    label: 'Direction Générale',
    description: 'Direction de l’Agence (management opérationnel, représentation légale)',
  },
  {
    value: 'Division Planification et Développement Territorial',
    label: 'Division Planification et Développement Territorial',
    description: 'PDC/PDD, SDADT/SCADT, diagnostic territorial, formation et renforcement des capacités',
  },
  {
    value: 'Division Ingénierie et Appui Technique',
    label: 'Division Ingénierie et Appui Technique',
    description: 'Infrastructures, travaux publics, passation des marchés, assistance technique aux communes',
  },
  {
    value: 'Division Suivi-Évaluation et Observatoire',
    label: 'Division Suivi-Évaluation et Observatoire',
    description: 'Suivi-évaluation des projets, observatoire territorial, données et indicateurs',
  },
  {
    value: 'Division Développement Local et Financement',
    label: 'Division Développement Local et Financement',
    description: 'Montage de projets, financement local, gouvernance et finances locales, foncier',
  },
  {
    value: 'Division Administration et Finances',
    label: 'Division Administration et Finances',
    description: 'Administration générale, ressources humaines, finances et fonctions support',
  },
];