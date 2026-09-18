'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle, AlertCircle, Globe, Mail, Phone, MapPin,
  BarChart3, Plus, Pencil, Trash2, X, Save,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import api from '@/lib/api';
import type { ParametreSite, ChiffreCle } from '@/types';
import { ContenusSection } from './ContenusSection';

// ─── Schéma paramètres généraux ─────────────────────────────────────────────

const siteSchema = z.object({
  nomSite:     z.string().min(1, 'Champ requis'),
  description: z.string().optional(),
  email:       z.string().email('Email invalide').optional().or(z.literal('')),
  telephone:   z.string().optional(),
  adresse:     z.string().optional(),
  ville:       z.string().optional(),
  facebook:    z.string().url('URL invalide').optional().or(z.literal('')),
  twitter:     z.string().url('URL invalide').optional().or(z.literal('')),
  linkedin:    z.string().url('URL invalide').optional().or(z.literal('')),
  youtube:     z.string().url('URL invalide').optional().or(z.literal('')),
  instagram:   z.string().url('URL invalide').optional().or(z.literal('')),
});
type SiteFormData = z.infer<typeof siteSchema>;

// ─── Schéma chiffre clé ──────────────────────────────────────────────────────

const chiffreSchema = z.object({
  label:       z.string().min(1, 'Label requis'),
  valeur:      z.string().min(1, 'Valeur requise'),
  icone:       z.string().optional(),
  description: z.string().optional(),
  ordre:       z.number().int().min(0).default(0),
  actif:       z.boolean().default(true),
});
type ChiffreFormData = z.infer<typeof chiffreSchema>;

// ─── Composant : formulaire inline chiffre clé ───────────────────────────────

interface ChiffreRowProps {
  chiffre?: ChiffreCle;
  onSave: (data: ChiffreFormData) => Promise<void>;
  onCancel: () => void;
}

function ChiffreForm({ chiffre, onSave, onCancel }: ChiffreRowProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<
    z.input<typeof chiffreSchema>,
    any,
    z.output<typeof chiffreSchema>
  >({
    resolver: zodResolver(chiffreSchema),
    defaultValues: chiffre
      ? {
          label:       chiffre.label,
          valeur:      chiffre.valeur,
          icone:       chiffre.icone ?? '',
          description: chiffre.description ?? '',
          ordre:       chiffre.ordre,
          actif:       chiffre.actif ?? true,
        }
      : { ordre: 0, actif: true },
  });

  const onSubmit = async (data: ChiffreFormData) => {
    setSaving(true);
    try { await onSave(data); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Input
          label="Label"
          {...register('label')}
          error={errors.label?.message}
          required
          placeholder="Ex: Projets réalisés"
        />
        <Input
          label="Valeur"
          {...register('valeur')}
          error={errors.valeur?.message}
          required
          placeholder="Ex: 120+"
        />
        <Input
          label="Icône (emoji)"
          {...register('icone')}
          placeholder="🏗️"
        />
        <Input
          label="Ordre"
          type="number"
          min={0}
          {...register('ordre', { valueAsNumber: true })}
        />
      </div>
      <Input
        label="Description (optionnel)"
        {...register('description')}
        placeholder="Précision complémentaire…"
      />
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none font-medium">
          <input type="checkbox" {...register('actif')} className="rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500" />
          Visible sur le site
        </label>
        <div className="flex gap-2 ml-auto">
          <button type="button" onClick={onCancel} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
            <X className="h-3.5 w-3.5" /> Annuler
          </button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors disabled:opacity-50 shadow-2xs cursor-pointer">
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </form>
  );
}

// ─── Section chiffres clés ───────────────────────────────────────────────────

function ChiffresSection() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const { data: chiffres = [], isLoading } = useQuery<ChiffreCle[]>({
    queryKey: ['admin-chiffres-cles'],
    queryFn: async () => {
      // Endpoint dédié admin : retourne les vrais enregistrements sans calculs auto
      const res = await api.get('/references/chiffres-cles-raw');
      return res.data ?? [];
    },
  });

  const items = chiffres;

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['admin-chiffres-cles'] });
    qc.invalidateQueries({ queryKey: ['admin-chiffres-cles-public'] });
    qc.invalidateQueries({ queryKey: ['chiffres-cles'] });
  };

  const handleCreate = async (data: ChiffreFormData) => {
    await api.post('/references/chiffres-cles', data);
    invalidate();
    setAdding(false);
  };

  const handleUpdate = async (id: string, data: ChiffreFormData) => {
    await api.patch(`/references/chiffres-cles/${id}`, data);
    invalidate();
    setEditingId(null);
  };

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Supprimer le chiffre clé "${label}" ?`)) return;
    await api.delete(`/references/chiffres-cles/${id}`);
    invalidate();
  };

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-700" /> Chiffres clés
        </h2>
        <p className="text-xs text-slate-400 mr-auto ml-3">Affiché sur la page d&apos;accueil</p>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-emerald-700 text-white rounded-xl hover:bg-emerald-800 font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter
          </button>
        )}
      </div>
      <div className="p-5 space-y-3">
        {/* Formulaire de création */}
        {adding && (
          <ChiffreForm
            onSave={handleCreate}
            onCancel={() => setAdding(false)}
          />
        )}

        {/* Liste des chiffres clés */}
        {isLoading ? (
          <p className="text-sm text-slate-400 text-center py-4">Chargement…</p>
        ) : items.length === 0 && !adding ? (
          <div className="text-center py-6 text-slate-400">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucun chiffre clé défini.</p>
            <p className="text-xs mt-1">
              Les valeurs calculées automatiquement (partenaires, départements…) sont affichées tant qu&apos;aucune entrée manuelle n&apos;existe.
            </p>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm text-emerald-700 border border-emerald-300 rounded-xl hover:bg-emerald-50 font-semibold transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Créer le premier chiffre
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((chiffre) =>
              editingId === chiffre.id ? (
                <ChiffreForm
                  key={chiffre.id}
                  chiffre={chiffre}
                  onSave={(data) => handleUpdate(chiffre.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div
                  key={chiffre.id}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-colors ${
                    chiffre.actif
                      ? 'bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200/60 opacity-60'
                  }`}
                >
                  {/* Icône */}
                  <span className="text-2xl w-8 text-center shrink-0">
                    {chiffre.icone || '📊'}
                  </span>

                  {/* Valeur + label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-extrabold text-emerald-700 tracking-tight">{chiffre.valeur}</span>
                      <span className="text-sm font-semibold text-slate-800">{chiffre.label}</span>
                      {!chiffre.actif && (
                        <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-medium">masqué</span>
                      )}
                    </div>
                    {chiffre.description && (
                      <p className="text-xs text-slate-400 truncate mt-0.5">{chiffre.description}</p>
                    )}
                  </div>

                  {/* Ordre */}
                  <span className="text-xs font-mono text-slate-400 shrink-0">#{chiffre.ordre}</span>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingId(chiffre.id)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(chiffre.id, chiffre.label)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        <p className="text-xs text-gray-400 pt-1">
          💡 Si aucune entrée n&apos;est définie ici, certaines valeurs sont calculées automatiquement depuis la base de données (partenaires actifs, départements, années d&apos;expérience).
        </p>
      </div>
    </Card>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────────

export default function AdminParametresPage() {
  const { data: params } = useQuery<ParametreSite>({
    queryKey: ['parametres-site'],
    queryFn: async () => {
      const res = await api.get('/references/parametres-site');
      return res.data;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SiteFormData>({
    resolver: zodResolver(siteSchema),
  });

  useEffect(() => {
    if (params) {
      // Le backend renvoie null pour les champs optionnels non renseignés.
      // Normalise null → '' pour que le schéma zod (optional + literal(''))
      // accepte ces champs vides sans erreur de validation.
      const clean = Object.fromEntries(
        Object.entries(params).map(([k, v]) => [k, v == null ? '' : v])
      ) as SiteFormData;
      reset(clean);
    }
  }, [params, reset]);

  const mutation = useMutation({
    mutationFn: (data: SiteFormData) => api.patch('/references/parametres-site', data),
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Paramètres du site</h1>
        <p className="text-sm text-slate-500 mt-1">Informations générales, coordonnées et chiffres clés</p>
      </div>

      {mutation.isSuccess && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 shadow-2xs" role="alert">
          <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-semibold">Paramètres sauvegardés avec succès.</p>
        </div>
      )}
      {mutation.isError && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200/80 rounded-2xl p-4 shadow-2xs" role="alert">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <p className="text-sm text-rose-800 font-semibold">Une erreur s&apos;est produite lors de la sauvegarde.</p>
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        {/* Infos générales */}
        <Card>
          <div className="p-5 border-b border-slate-200/80">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-700" /> Informations générales
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <Input label="Nom du site" {...register('nomSite')} error={errors.nomSite?.message} required />
            <Textarea label="Description" rows={3} {...register('description')} placeholder="Description courte du site…" />
          </div>
        </Card>

        {/* Coordonnées */}
        <Card>
          <div className="p-5 border-b border-slate-200/80">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-700" /> Coordonnées
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Email" type="email" {...register('email')} error={errors.email?.message} icon={<Mail className="h-4 w-4" />} />
              <Input label="Téléphone" type="tel" {...register('telephone')} icon={<Phone className="h-4 w-4" />} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Adresse" {...register('adresse')} />
              <Input label="Ville" {...register('ville')} />
            </div>
          </div>
        </Card>

        {/* Réseaux sociaux */}
        <Card>
          <div className="p-5 border-b border-slate-200/80">
            <h2 className="font-bold text-slate-900">Réseaux sociaux</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Facebook" type="url" {...register('facebook')} error={errors.facebook?.message} placeholder="https://facebook.com/…" />
              <Input label="Twitter / X" type="url" {...register('twitter')} error={errors.twitter?.message} placeholder="https://twitter.com/…" />
              <Input label="LinkedIn" type="url" {...register('linkedin')} error={errors.linkedin?.message} placeholder="https://linkedin.com/…" />
              <Input label="YouTube" type="url" {...register('youtube')} error={errors.youtube?.message} placeholder="https://youtube.com/…" />
              <Input label="Instagram" type="url" {...register('instagram')} error={errors.instagram?.message} placeholder="https://instagram.com/…" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={mutation.isPending} size="lg">
            Sauvegarder les paramètres
          </Button>
        </div>
      </form>

      {/* Chiffres clés — section indépendante, pas dans le form principal */}
      <ChiffresSection />

      {/* Contenus éditoriaux — textes et listes des pages publiques */}
      <ContenusSection />
    </div>
  );
}
