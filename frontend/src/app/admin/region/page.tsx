'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Plus, Pencil, Trash2, Save, MapPin, Building2 } from 'lucide-react';
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
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Départements
        </h2>
        <p className="text-xs text-gray-400 mt-1">Modification des départements existants.</p>
      </div>
      <div className="p-5 space-y-3">
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucun département.</p>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <form
                key={item.id}
                onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
                className="bg-blue-50/60 border border-primary/20 rounded-xl p-4 space-y-3"
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
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.nom}
                    <span className="ml-2 text-xs text-gray-400">#{item.code}</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {item.superficie ? `${item.superficie.toLocaleString('fr-FR')} km²` : '— superf. —'}
                    {item.population ? ` · ${item.population.toLocaleString('fr-FR')} hab.` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
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
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Arrondissements
        </h2>
        <p className="text-xs text-gray-400 mt-1">Modification des arrondissements existants.</p>
      </div>
      <div className="p-5 space-y-3">
        {isLoading ? (
          <LoadingState />
        ) : items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucun arrondissement.</p>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <form
                key={item.id}
                onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }}
                className="bg-blue-50/60 border border-primary/20 rounded-xl p-4 space-y-3"
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
              <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{item.nom}
                    <span className="ml-2 text-xs text-gray-400">#{item.code}</span>
                  </p>
                  <p className="text-xs text-gray-400 truncate">{item.departement?.nom ?? '—'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                  title="Modifier"
                >
                  <Pencil className="h-3.5 w-3.5" />
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

  const resetForm = () => { setForm(emptyCommune); setEditingId(null); };

  const set = (k: keyof typeof emptyCommune, v: string | number | undefined) =>
    setForm((f) => ({ ...f, [k]: v }));

  const refresh = () => {
    qc.invalidateQueries({ queryKey: COM_KEY });
    qc.invalidateQueries({ queryKey: ARR_KEY });
  };

  const createMutation = useMutation({
    mutationFn: (d: Partial<Commune>) => api.post('/references/communes', d),
    onSuccess: () => { refresh(); resetForm(); },
  });
  const updateMutation = useMutation({
    mutationFn: (v: { id: string; d: Partial<Commune> }) => api.patch(`/references/communes/${v.id}`, v.d),
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
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Communes
        </h2>
        <p className="text-xs text-gray-400">Création et modification autorisées.</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Formulaire de création */}
        <form
          onSubmit={(e) => { e.preventDefault(); createMutation.mutate({ ...form, code: form.code || makeCode(form.nom || 'commune') }); }}
          className="bg-green-50/60 border border-green-200 rounded-xl p-4 space-y-3"
        >
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Plus className="h-4 w-4 text-primary" /> Nouvelle commune
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="Nom" value={form.nom} onChange={(e) => set('nom', e.target.value)} required placeholder="Nom de la commune" />
            <Input label="Code" value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="laissé vide = auto" />
            <Select
              label="Département"
              options={departements.map((d) => ({ value: d.id, label: d.nom }))}
              value={form.departementId}
              onChange={(e) => set('departementId', e.target.value)}
              required
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
          <p className="text-sm text-gray-400 text-center py-4">Aucune commune.</p>
        ) : (
          <div className="space-y-2">
            {items.map((item) =>
              editingId === item.id ? (
                <form
                  key={item.id}
                  onSubmit={(e) => { e.preventDefault(); updateMutation.mutate({ id: item.id, d: form }); }}
                  className="bg-blue-50/60 border border-primary/20 rounded-xl p-4 space-y-3"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                      label="Arrondissement (facultatif)"
                      options={arrondissements.map((a) => ({ value: a.id, label: a.nom }))}
                      value={form.arrondissementId ?? ''}
                      onChange={(e) => set('arrondissementId', e.target.value)}
                      placeholder="Aucun"
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
                <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 bg-white">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.nom}
                      <span className="ml-2 text-xs text-gray-400">#{item.code}</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {item.departement?.nom ?? '—'}
                      {item.arrondissement ? ` · ${item.arrondissement.nom}` : ''}
                      {item.population ? ` · ${item.population.toLocaleString('fr-FR')} hab.` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                    title="Modifier"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (confirm(`Supprimer la commune "${item.nom}" ?`)) deleteMutation.mutate(item.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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