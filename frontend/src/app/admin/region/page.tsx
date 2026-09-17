'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, MapPin, Building2 } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { LoadingState } from '@/components/ui/Spinner';
import { referencesService } from '@/services/references.service';
import { slugify } from '@/lib/utils';
import api from '@/lib/api';
import type { Departement, Arrondissement, Commune } from '@/types';

// Génère un code technique unique à partir d'un nom (pour les créations de communes)
function makeCode(base: string) {
  const clean = slugify(base).replace(/[^a-z0-9]/g, '').slice(0, 10);
  return `${clean || 'ref'}-${Date.now().toString().slice(-6)}`;
}

// ─── Section Départements (modification seule, pas de création) ──────────────

const DEP_KEY = ['ref-departements'];

function DepartementSection() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery<Departement[]>({
    queryKey: DEP_KEY,
    queryFn: () => referencesService.getDepartements(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Departement>>({});

  const mutation = useMutation({
    mutationFn: (d: Partial<Departement>) => api.patch(`/references/departements/${editingId}`, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DEP_KEY });
      setEditingId(null);
    },
  });

  const startEdit = (item: Departement) => {
    setEditingId(item.id);
    setForm({
      nom: item.nom,
      code: item.code,
      superficie: item.superficie,
      population: item.population,
      description: item.description,
      image: item.image,
    });
  };

  const set = (k: keyof Departement, v: string | number | undefined) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-700" /> Départements
        </h2>
        <p className="text-xs text-slate-400 mt-1">Modification des départements existants.</p>
      </div>
      <div className="p-5 space-y-3">
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Aucun département.</p>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <form
                key={item.id}
                onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
                className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input label="Nom" value={form.nom ?? ''} onChange={(e) => set('nom', e.target.value)} required />
                  <Input label="Code" value={form.code ?? ''} onChange={(e) => set('code', e.target.value)} required />
                  <Input label="Superficie (km²)" type="number" value={form.superficie ?? ''} onChange={(e) => set('superficie', e.target.value ? Number(e.target.value) : undefined)} />
                  <Input label="Population" type="number" value={form.population ?? ''} onChange={(e) => set('population', e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <ImageUpload
                  label="Image"
                  value={form.image ?? ''}
                  onChange={(url) => set('image', url)}
                  aspectRatio="wide"
                />
                <RichTextEditor
                  label="Description"
                  value={form.description ?? ''}
                  onChange={(v) => set('description', v)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" size="sm" onClick={() => setEditingId(null)}>Annuler</Button>
                  <Button type="submit" size="sm" loading={mutation.isPending}>Enregistrer</Button>
                </div>
              </form>
            ) : (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 bg-white shadow-2xs transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.nom}
                    <span className="ml-2 text-xs text-slate-400 font-mono">#{item.code}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {item.superficie ? `${item.superficie.toLocaleString('fr-FR')} km²` : '— superf. —'}
                    {item.population ? ` · ${item.population.toLocaleString('fr-FR')} hab.` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  title="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )
          )
        )}
      </div>
    </Card>
  );
}

// ─── Section Arrondissements (modification seule, pas de création) ────────────

const ARR_KEY = ['ref-arrondissements'];

function ArrondissementSection() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery<Arrondissement[]>({
    queryKey: ARR_KEY,
    queryFn: () => referencesService.getArrondissements(),
  });
  const { data: departements = [] } = useQuery<Departement[]>({
    queryKey: DEP_KEY,
    queryFn: () => referencesService.getDepartements(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Arrondissement>>({});

  const mutation = useMutation({
    mutationFn: (d: Partial<Arrondissement>) => api.patch(`/references/arrondissements/${editingId}`, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ARR_KEY });
      setEditingId(null);
    },
  });

  const startEdit = (item: Arrondissement) => {
    setEditingId(item.id);
    setForm({
      nom: item.nom,
      code: item.code,
      description: item.description,
      departementId: item.departement?.id ?? '',
    });
  };

  const set = (k: keyof Arrondissement, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-emerald-700" /> Arrondissements
        </h2>
        <p className="text-xs text-slate-400 mt-1">Modification des arrondissements existants.</p>
      </div>
      <div className="p-5 space-y-3">
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Aucun arrondissement.</p>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <form
                key={item.id}
                onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
                className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="Nom" value={form.nom ?? ''} onChange={(e) => set('nom', e.target.value)} required />
                  <Input label="Code" value={form.code ?? ''} onChange={(e) => set('code', e.target.value)} required />
                  <Select
                    label="Département"
                    options={departements.map((d) => ({ value: d.id, label: d.nom }))}
                    value={form.departementId ?? ''}
                    onChange={(e) => set('departementId', e.target.value)}
                    required
                  />
                </div>
                <RichTextEditor
                  label="Description"
                  value={form.description ?? ''}
                  onChange={(v) => set('description', v)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" size="sm" onClick={() => setEditingId(null)}>Annuler</Button>
                  <Button type="submit" size="sm" loading={mutation.isPending}>Enregistrer</Button>
                </div>
              </form>
            ) : (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 bg-white shadow-2xs transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900">{item.nom}
                    <span className="ml-2 text-xs text-slate-400 font-mono">#{item.code}</span>
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{item.departement?.nom ?? '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  title="Modifier"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )
          )
        )}
      </div>
    </Card>
  );
}
// ─── Section Communes (création + modification + suppression) ─────────────────

const COM_KEY = ['ref-communes'];

const emptyCommune = {
  nom: '',
  code: '',
  departementId: '',
  arrondissementId: '',
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  superficie: undefined as number | undefined,
  population: undefined as number | undefined,
  description: '',
  image: '',
};

function CommuneSection() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery<Commune[]>({
    queryKey: COM_KEY,
    queryFn: () => referencesService.getCommunes(),
  });
  const { data: departements = [] } = useQuery<Departement[]>({
    queryKey: DEP_KEY,
    queryFn: () => referencesService.getDepartements(),
  });
  const { data: arrondissements = [] } = useQuery<Arrondissement[]>({
    queryKey: ARR_KEY,
    queryFn: () => referencesService.getArrondissements(),
  });

  const [form, setForm] = useState<Partial<Commune>>(emptyCommune);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Arrondissements filtrés selon le département choisi du formulaire
  const arrondissementsFiltres = arrondissements.filter(
    (a) => !form.departementId || a.departement?.id === form.departementId,
  );

  // Change le département et réinitialise l'arrondissement s'il n'appartient plus au département
  const setDepartement = (departementId: string) => {
    const arrOk = arrondissements.some(
      (a) => a.id === form.arrondissementId && a.departement?.id === departementId,
    );
    setForm((f) => ({ ...f, departementId, arrondissementId: arrOk ? f.arrondissementId : '' }));
  };

  const resetForm = () => { setForm(emptyCommune); setEditingId(null); };

  const set = (k: keyof typeof emptyCommune, v: string | number | undefined) =>
    setForm((f) => ({ ...f, [k]: v }));

  const refresh = () => {
    qc.invalidateQueries({ queryKey: COM_KEY });
    qc.invalidateQueries({ queryKey: ARR_KEY });
  };

  const sanitizeCommune = (d: Partial<Commune>) => ({
    ...d,
    // "" (placeholder des <Select>) n'est pas un id valide → undefined pour éviter une violation FK
    departementId: d.departementId || undefined,
    arrondissementId: d.arrondissementId || undefined,
  });

  const createMutation = useMutation({
    mutationFn: (d: Partial<Commune>) => api.post('/references/communes', sanitizeCommune(d)),
    onSuccess: () => { refresh(); resetForm(); },
  });
  const updateMutation = useMutation({
    mutationFn: (v: { id: string; d: Partial<Commune> }) => api.patch(`/references/communes/${v.id}`, sanitizeCommune(v.d)),
    onSuccess: refresh,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/references/communes/${id}`),
    onSuccess: refresh,
  });

  const startEdit = (item: Commune) => {
    setEditingId(item.id);
    setForm({
      nom: item.nom,
      code: item.code,
      departementId: item.departement?.id ?? '',
      arrondissementId: item.arrondissement?.id ?? '',
      latitude: item.latitude,
      longitude: item.longitude,
      superficie: item.superficie,
      population: item.population,
      description: item.description ?? '',
      image: item.image ?? '',
    });
  };

  return (
    <Card>
      <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-emerald-700" /> Communes
        </h2>
        <p className="text-xs text-slate-400">Création et modification autorisées.</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Formulaire de création */}
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, code: form.code || makeCode(form.nom || 'commune') }); }}
          className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3"
        >
          <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Plus className="h-4 w-4 text-emerald-700" /> Nouvelle commune
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Nom" value={form.nom} onChange={(e) => set('nom', e.target.value)} required placeholder="Nom de la commune" />
            <Input label="Code" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="laissé vide = auto" />
            <Select
              label="Département"
              options={departements.map((d) => ({ value: d.id, label: d.nom }))}
              value={form.departementId}
              onChange={(e) => setDepartement(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Arrondissement (facultatif)"
              options={arrondissementsFiltres.map((a) => ({ value: a.id, label: a.nom }))}
              value={form.arrondissementId ?? ''}
              onChange={(e) => set('arrondissementId', e.target.value)}
              placeholder={form.departementId ? 'Aucun (rattachée au département)' : 'Choisir un département d’abord'}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="submit" size="sm" loading={createMutation.isPending}>Créer la commune</Button>
          </div>
        </form>
        {/* Liste / modification */}
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">Aucune commune.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) =>
              editingId === item.id ? (
                <form
                  key={item.id}
                  onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: item.id, d: form }); }}
                  className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input label="Nom" value={form.nom ?? ''} onChange={(e) => set('nom', e.target.value)} required />
                    <Input label="Code" value={form.code ?? ''} onChange={(e) => set('code', e.target.value)} required />
                    <Select
                      label="Département"
                      options={departements.map((d) => ({ value: d.id, label: d.nom }))}
                      value={form.departementId ?? ''}
                      onChange={(e) => setDepartement(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                      label="Arrondissement (facultatif)"
                      options={arrondissementsFiltres.map((a) => ({ value: a.id, label: a.nom }))}
                      value={form.arrondissementId ?? ''}
                      onChange={(e) => set('arrondissementId', e.target.value)}
                      placeholder={form.departementId ? 'Aucun (rattachée au département)' : 'Choisir un département d’abord'}
                    />
                    <Input label="Latitude" type="number" step="any" value={form.latitude ?? ''} onChange={(e) => set('latitude', e.target.value ? Number(e.target.value) : undefined)} />
                    <Input label="Longitude" type="number" step="any" value={form.longitude ?? ''} onChange={(e) => set('longitude', e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input label="Superficie (km²)" type="number" value={form.superficie ?? ''} onChange={(e) => set('superficie', e.target.value ? Number(e.target.value) : undefined)} />
                    <Input label="Population" type="number" value={form.population ?? ''} onChange={(e) => set('population', e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                  <ImageUpload
                    label="Image"
                    value={form.image ?? ''}
                    onChange={(url) => set('image', url)}
                    aspectRatio="wide"
                  />
                  <RichTextEditor
                    label="Description"
                    value={form.description ?? ''}
                    onChange={(v) => set('description', v)}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" type="button" size="sm" onClick={resetForm}>Annuler</Button>
                    <Button type="submit" size="sm" loading={updateMutation.isPending}>Enregistrer</Button>
                  </div>
                </form>
              ) : (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-200/80 hover:border-emerald-300 bg-white shadow-2xs transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{item.nom}
                      <span className="ml-2 text-xs text-slate-400 font-mono">#{item.code}</span>
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.departement?.nom ?? '—'}
                      {item.arrondissement ? ` · ${item.arrondissement.nom}` : ''}
                      {item.population ? ` · ${item.population.toLocaleString('fr-FR')} hab.` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (confirm(`Supprimer la commune "${item.nom}" ?`)) deleteMutation.mutate(item.id); }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AdminRegionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Région & Territoires"
          description="Gestion des départements, arrondissements et communes"
        />
      </div>

      <DepartementSection />
      <ArrondissementSection />
      <CommuneSection />
    </div>
  );
}