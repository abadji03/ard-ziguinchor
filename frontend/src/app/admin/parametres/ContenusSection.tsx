'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LayoutList,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { referencesService } from '@/services/references.service';
import type { ContenuEditorial } from '@/types';
import {
  CONTENU_TYPES,
  CONTENU_SECTIONS,
  ICONES_DISPONIBLES,
  contenuTypeLabel,
  contenuSectionLabel,
} from '@/lib/contenus';

/**
 * Contenus éditoriaux : textes et listes affichés sur les pages publiques
 * (missions, organisation, jalons, atouts, sous-pages…).
 *
 * Ces données étaient auparavant codées en dur dans le code : elles sont
 * désormais stockées en base et modifiables ici, sans nouvelle livraison.
 */

interface ContenuFormState {
  type: string;
  section: string;
  titre: string;
  sousTitre: string;
  description: string;
  icone: string;
  couleur: string;
  lien: string;
  ordre: number;
  actif: boolean;
}

const emptyForm = (type?: string): ContenuFormState => ({
  type: type ?? 'MISSION',
  section: 'general',
  titre: '',
  sousTitre: '',
  description: '',
  icone: '',
  couleur: '',
  lien: '',
  ordre: 0,
  actif: true,
});

function ContenuForm({
  contenu,
  type,
  onClose,
}: {
  contenu?: ContenuEditorial;
  /** Type pré-sélectionné lors d'une création (issu du filtre courant). */
  type?: string;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [form, setForm] = useState<ContenuFormState>(
    contenu
      ? {
          type: contenu.type,
          section: contenu.section ?? 'general',
          titre: contenu.titre,
          sousTitre: contenu.sousTitre ?? '',
          description: contenu.description ?? '',
          icone: contenu.icone ?? '',
          couleur: contenu.couleur ?? '',
          lien: contenu.lien ?? '',
          ordre: contenu.ordre,
          actif: contenu.actif,
        }
      : emptyForm(type),
  );

  const mutation = useMutation({
    mutationFn: (payload: ContenuFormState) => {
      const body = {
        ...payload,
        section: payload.section || undefined,
        // Champs texte vides → null pour ne pas polluer la base.
        sousTitre: payload.sousTitre || null,
        description: payload.description || null,
        icone: payload.icone || null,
        couleur: payload.couleur || null,
        lien: payload.lien || null,
      };
      return contenu
        ? referencesService.updateContenuEditorial(contenu.id, body as Partial<ContenuEditorial>)
        : referencesService.createContenuEditorial(body as Partial<ContenuEditorial>);
    },
    onSuccess: () => {
      // `['contenus']` couvre aussi les hooks publics `useContenusSection` /
      // `useContenusType` : la page publique se rafraîchit dès la sauvegarde.
      qc.invalidateQueries({ queryKey: ['contenus-editoriaux'] });
      qc.invalidateQueries({ queryKey: ['contenus'] });
      onClose();
    },
  });

  const set = <K extends keyof ContenuFormState>(key: K, value: ContenuFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const typeDef = CONTENU_TYPES.find((t) => t.value === form.type);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(form);
      }}
      className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-bold text-slate-800">
          {contenu ? 'Modifier le contenu' : 'Nouveau contenu'}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
          title="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Type de contenu"
          options={CONTENU_TYPES.map((t) => ({ value: t.value, label: t.label }))}
          value={form.type}
          onChange={(e) => set('type', e.target.value)}
        />
        <Select
          label="Emplacement (page)"
          options={CONTENU_SECTIONS.map((s) => ({ value: s.value, label: s.label }))}
          value={form.section}
          onChange={(e) => set('section', e.target.value)}
        />
      </div>
      {typeDef && <p className="text-xs text-slate-500 -mt-1">{typeDef.description}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input
          label="Titre"
          value={form.titre}
          onChange={(e) => set('titre', e.target.value)}
          required
          placeholder="Planification Territoriale"
        />
        <Input
          label="Sous-titre / badge"
          value={form.sousTitre}
          onChange={(e) => set('sousTitre', e.target.value)}
          placeholder="Axe 01 ou 2008"
        />
        <Select
          label="Icône (Lucide)"
          options={[
            { value: '', label: 'Aucune' },
            ...ICONES_DISPONIBLES.map((i) => ({ value: i as string, label: i as string })),
          ]}
          value={form.icone}
          onChange={(e) => set('icone', e.target.value)}
        />
        <Input
          label="Couleur d'accent"
          value={form.couleur}
          onChange={(e) => set('couleur', e.target.value)}
          placeholder="emerald, amber…"
        />
      </div>

      <Textarea
        label="Description"
        rows={3}
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="Texte affiché sous le titre…"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          label="Lien (optionnel)"
          value={form.lien}
          onChange={(e) => set('lien', e.target.value)}
          placeholder="/la-region/departements"
        />
        <Input
          label="Ordre d'affichage"
          type="number"
          min={0}
          value={form.ordre}
          onChange={(e) => set('ordre', Number(e.target.value))}
        />
        <label className="flex items-end gap-2 text-sm text-slate-700 cursor-pointer select-none font-medium pb-2.5">
          <input
            type="checkbox"
            checked={form.actif}
            onChange={(e) => set('actif', e.target.checked)}
            className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Visible sur le site
        </label>
      </div>

      {mutation.isError && (
        <p className="text-xs text-rose-700 font-medium">
          Une erreur est survenue lors de l&apos;enregistrement.
        </p>
      )}

      <div className="flex gap-2 justify-end pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" size="sm" loading={mutation.isPending}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
}


// ── Section principale : filtres + liste ────────────────────────────────────

export function ContenusSection() {
  const qc = useQueryClient();
  const [type, setType] = useState<string>('MISSION');
  const [section, setSection] = useState<string>('all');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: contenus = [], isLoading } = useQuery<ContenuEditorial[]>({
    queryKey: ['contenus-editoriaux', type, section],
    queryFn: () =>
      referencesService.getContenusEditoriaux({
        type: type === 'all' ? undefined : type,
        section: section === 'all' ? undefined : section,
        // Côté admin on affiche aussi les blocs masqués.
        includeInactifs: true,
      }),
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['contenus-editoriaux'] });
    qc.invalidateQueries({ queryKey: ['contenus-section'] });
    qc.invalidateQueries({ queryKey: ['contenus'] });
  };

  const removeMutation = useMutation({
    mutationFn: (id: string) => referencesService.deleteContenuEditorial(id),
    onSuccess: invalidate,
  });

  const toggleMutation = useMutation({
    mutationFn: (contenu: ContenuEditorial) =>
      referencesService.updateContenuEditorial(contenu.id, {
        actif: !contenu.actif,
      }),
    onSuccess: invalidate,
  });

  const handleDelete = (contenu: ContenuEditorial) => {
    if (!confirm(`Supprimer le contenu « ${contenu.titre} » ?`)) return;
    removeMutation.mutate(contenu.id);
  };

  const typeDef = CONTENU_TYPES.find((t) => t.value === type);
  const items = useMemo(
    () => [...contenus].sort((a, b) => a.ordre - b.ordre || a.titre.localeCompare(b.titre)),
    [contenus],
  );

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80 flex flex-wrap items-center gap-3">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <LayoutList className="h-4 w-4 text-emerald-700" /> Contenus &amp; textes
        </h2>
        <p className="text-xs text-slate-400 mr-auto">
          Missions, organisation, jalons, atouts, rubriques… modifiables sans toucher au code
        </p>
        {!adding && (
          <button
            type="button"
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </button>
        )}
      </div>

      {/* Filtres : type de bloc + emplacement */}
      <div className="px-5 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Select
          label="Type de contenu"
          options={[
            { value: 'all', label: 'Tous les types' },
            ...CONTENU_TYPES.map((t) => ({ value: t.value, label: t.label })),
          ]}
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setEditingId(null);
          }}
        />
        <Select
          label="Emplacement (page)"
          options={[
            { value: 'all', label: 'Tous les emplacements' },
            ...CONTENU_SECTIONS.map((s) => ({ value: s.value, label: s.label })),
          ]}
          value={section}
          onChange={(e) => {
            setSection(e.target.value);
            setEditingId(null);
          }}
        />
        <div className="flex items-end pb-2">
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
            {items.length} bloc{items.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      {typeDef && <p className="px-5 pt-2 text-xs text-slate-500">{typeDef.description}</p>}

      <div className="p-5 space-y-3">
        {adding && (
          <ContenuForm
            type={type === 'all' ? undefined : type}
            onClose={() => setAdding(false)}
          />
        )}
{isLoading ? (
          <p className="text-sm text-slate-400 text-center py-4">Chargement…</p>
        ) : items.length === 0 && !adding ? (
          <div className="text-center py-6 text-slate-400">
            <LayoutList className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun contenu pour ce filtre.</p>
            <p className="text-xs mt-1">
              Ajoutez un bloc pour alimenter la page publique correspondante.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((contenu) =>
              editingId === contenu.id ? (
                <ContenuForm
                  key={contenu.id}
                  contenu={contenu}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={contenu.id}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors ${
                    contenu.actif
                      ? 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  <span className="text-xs font-mono text-slate-400 w-6 text-center shrink-0">
                    #{contenu.ordre}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">{contenu.titre}</span>
                      {contenu.sousTitre && (
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {contenu.sousTitre}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {contenuTypeLabel(contenu.type)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {contenuSectionLabel(contenu.section)}
                      </span>
                      {!contenu.actif && (
                        <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                          masqué
                        </span>
                      )}
                    </div>
                    {contenu.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {contenu.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleMutation.mutate(contenu)}
                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                      title={contenu.actif ? 'Masquer sur le site' : 'Afficher sur le site'}
                    >
                      {contenu.actif ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(contenu.id);
                        setAdding(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(contenu)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 pt-1">
          💡 Ces blocs alimentent les pages publiques (accueil, À propos, La Région…). Masquer un
          bloc le retire du site sans le supprimer.
        </p>
      </div>
    </Card>
  );
}